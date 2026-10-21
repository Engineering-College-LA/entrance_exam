import { createClient } from 'npm:@supabase/supabase-js@2'
import { canonicalString, canonicalStringLiteral, describeKey, verify } from '../_shared/signer.ts'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // TEMPORARY diagnostic logging — remove once we've confirmed Finik's real
  // webhook shape (headers/body aren't secrets, safe to log).
  const rawBody = await req.text()
  console.log('[finik-webhook] headers:', JSON.stringify(Object.fromEntries(req.headers.entries())))
  console.log('[finik-webhook] rawBody:', rawBody)

  const webhookPublicKey = Deno.env.get('FINIK_WEBHOOK_PUBLIC_KEY')
  const webhookUrl = Deno.env.get('FINIK_WEBHOOK_URL')
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!webhookPublicKey || !webhookUrl || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: 'Webhook is not configured' }, 500)
  }
  console.log('[finik-webhook] FINIK_WEBHOOK_PUBLIC_KEY:', describeKey(webhookPublicKey))

  const signature = req.headers.get('signature')
  if (!signature) {
    console.error('[finik-webhook] rejected: missing signature header')
    return json({ error: 'Missing signature header' }, 400)
  }

  const apiHeaders: Record<string, string> = {}
  for (const [key, value] of req.headers.entries()) {
    if (key.toLowerCase().startsWith('x-api-')) apiHeaders[key] = value
  }

  // webhookUrl is OUR domain (configured, not the request host) — Finik
  // signs against the webhookUrl we gave them when creating the payment.
  const webhookPath = new URL(webhookUrl).pathname
  const webhookHost = new URL(webhookUrl).host

  const body = JSON.parse(rawBody || '{}') as Record<string, unknown>
  const dataLiteral = canonicalStringLiteral('POST', webhookPath, webhookHost, apiHeaders, rawBody)
  const dataRaw = canonicalString('POST', webhookPath, webhookHost, apiHeaders, body)
  const dataPhp = canonicalString('POST', webhookPath, webhookHost, apiHeaders, body, {}, 'php')

  // Try several candidate encodings (see signer.ts) — whichever one actually
  // matches Finik's signature tells us how their backend builds the string
  // to sign, so TEMPORARY: keep all log lines until we know which one
  // consistently wins, then delete the others.
  let verified = false
  let matched = ''
  outer: for (const [bodyLabel, data] of [
    ['literal', dataLiteral],
    ['raw', dataRaw],
    ['php-escaped', dataPhp],
  ] as const) {
    for (const padding of ['pkcs1', 'pss'] as const) {
      if (verify(data, signature, webhookPublicKey, padding)) {
        verified = true
        matched = `${bodyLabel}+${padding}`
        break outer
      }
    }
  }

  if (verified) {
    console.log(`[finik-webhook] signature verified ok (encoding: ${matched})`)
  } else {
    console.error('[finik-webhook] rejected: invalid signature. canonicalString (literal) was:', dataLiteral)
    console.error('[finik-webhook] rejected: invalid signature. canonicalString (raw) was:', dataRaw)
    console.error('[finik-webhook] rejected: invalid signature. canonicalString (php) was:', dataPhp)
    return json({ error: 'Invalid signature' }, 400)
  }

  // Confirmed against a real webhook call (see diagnostic logs): our own
  // reference is in `transactionId`, Finik's own id is the top-level `id`,
  // and a completed payment reports status "succeeded" — not the generic
  // names ("PaymentId"/"transactionId"/"success") a third-party reference
  // implementation used for a differently-configured integration.
  const paymentId = typeof body.transactionId === 'string' ? body.transactionId : undefined
  const finikTransactionId = typeof body.id === 'string' ? body.id : undefined

  if (!paymentId) {
    console.error('[finik-webhook] rejected: missing transactionId. body was:', rawBody)
    return json({ error: 'Missing transactionId in webhook payload' }, 400)
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  // We control the PaymentId format: "pe_..." for exam payments,
  // "oly_..." for Olympiad payments. Try the matching table first, then
  // fall back to checking the other in case the prefix convention changes.
  const tablesToTry: Array<'paid_exam_registrations' | 'olympiad_registrations'> =
    paymentId.startsWith('oly_')
      ? ['olympiad_registrations', 'paid_exam_registrations']
      : ['paid_exam_registrations', 'olympiad_registrations']

  let table: 'paid_exam_registrations' | 'olympiad_registrations' | null = null
  let existingStatus: string | null = null

  // A transient read error must NOT be treated the same as "no such row" —
  // that previously fell through to a 404, which Finik won't retry, leaving
  // the registration stuck on 'pending' forever even though the row exists.
  for (const t of tablesToTry) {
    const { data: existing, error: selectError } = await admin
      .from(t)
      .select('id, payment_status')
      .eq('id', paymentId)
      .maybeSingle()
    if (selectError) {
      console.error(`[finik-webhook] select failed on ${t}:`, selectError.message)
      return json({ error: 'Could not look up payment' }, 500)
    }
    if (existing) {
      table = t
      existingStatus = existing.payment_status
      break
    }
  }

  if (!table) {
    console.error(`[finik-webhook] rejected: unknown payment id ${paymentId}`)
    return json({ error: 'Unknown payment id' }, 404)
  }

  if (existingStatus === 'pending') {
    const resultStatus = resolveStatus(body)
    // Unrecognized status: leave as pending rather than guessing — a future
    // webhook (success or failure) will resolve it, or it surfaces for
    // manual review instead of silently misreporting.
    if (resultStatus) {
      const { error: updateError } = await admin
        .from(table)
        .update({
          payment_status: resultStatus,
          finik_transaction_id: finikTransactionId ?? null,
          paid_at: resultStatus === 'paid' ? new Date().toISOString() : null,
        })
        .eq('id', paymentId)
      // Must fail loudly: a 200 here tells Finik delivery succeeded, so it
      // will never retry — a swallowed error here means the row is stuck on
      // 'pending' with no further chance to self-heal.
      if (updateError) {
        console.error(`[finik-webhook] update failed on ${table}:`, updateError.message)
        return json({ error: 'Could not update payment status' }, 500)
      }
      console.log(`[finik-webhook] updated ${table} ${paymentId} -> ${resultStatus}`)
    } else {
      console.log(`[finik-webhook] unrecognized status, left pending:`, body.status)
    }
  } else {
    console.log(`[finik-webhook] ${paymentId} already ${existingStatus}, no-op`)
  }

  return json({ ok: true })
})

function resolveStatus(body: Record<string, unknown>): 'paid' | 'failed' | null {
  const status = typeof body.status === 'string' ? body.status.toLowerCase() : ''
  if (status === 'succeeded' || status === 'success' || status === 'paid' || status === 'approved')
    return 'paid'
  if (status === 'failed' || status === 'declined' || status === 'cancelled' || status === 'canceled')
    return 'failed'
  return null
}
