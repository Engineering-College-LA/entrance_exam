import { createClient } from 'npm:@supabase/supabase-js@2'
import { canonicalString, verify } from '../_shared/signer.ts'

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

  const signature = req.headers.get('signature')
  if (!signature) return json({ error: 'Missing signature header' }, 400)

  const apiHeaders: Record<string, string> = {}
  for (const [key, value] of req.headers.entries()) {
    if (key.toLowerCase().startsWith('x-api-')) apiHeaders[key] = value
  }

  // webhookUrl is OUR domain (configured, not the request host) — Finik
  // signs against the webhookUrl we gave them when creating the payment.
  const webhookPath = new URL(webhookUrl).pathname
  const webhookHost = new URL(webhookUrl).host

  const body = JSON.parse(rawBody || '{}') as Record<string, unknown>
  const data = canonicalString('POST', webhookPath, webhookHost, apiHeaders, body)

  if (!verify(data, signature, webhookPublicKey)) {
    return json({ error: 'Invalid signature' }, 400)
  }

  // Confirmed against a real webhook call (see diagnostic logs): our own
  // reference is in `transactionId`, Finik's own id is the top-level `id`,
  // and a completed payment reports status "succeeded" — not the generic
  // names ("PaymentId"/"transactionId"/"success") a third-party reference
  // implementation used for a differently-configured integration.
  const paymentId = typeof body.transactionId === 'string' ? body.transactionId : undefined
  const finikTransactionId = typeof body.id === 'string' ? body.id : undefined

  if (!paymentId) return json({ error: 'Missing transactionId in webhook payload' }, 400)

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  const { data: existing, error: fetchError } = await admin
    .from('paid_exam_registrations')
    .select('id, payment_status')
    .eq('id', paymentId)
    .maybeSingle()

  if (fetchError || !existing) return json({ error: 'Unknown payment id' }, 404)

  if (existing.payment_status === 'pending') {
    const resultStatus = resolveStatus(body)
    // Unrecognized status: leave as pending rather than guessing — a future
    // webhook (success or failure) will resolve it, or it surfaces for
    // manual review instead of silently misreporting.
    if (resultStatus) {
      await admin
        .from('paid_exam_registrations')
        .update({
          payment_status: resultStatus,
          finik_transaction_id: finikTransactionId ?? null,
          paid_at: resultStatus === 'paid' ? new Date().toISOString() : null,
        })
        .eq('id', paymentId)
    }
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
