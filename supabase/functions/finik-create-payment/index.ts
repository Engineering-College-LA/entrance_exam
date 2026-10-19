import { createClient } from 'npm:@supabase/supabase-js@2'
import { canonicalString, sign } from '../_shared/signer.ts'

const PHONE_RE = /^\+996\d{9}$/
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS_HEADERS },
  })
}

function validateForm(
  form: Record<string, unknown>,
  requireParentInfo: boolean,
  requireSchool: boolean,
  requireOlympiadExtras: boolean,
): string | null {
  if (typeof form.firstName !== 'string' || !form.firstName.trim())
    return 'firstName is required'
  if (typeof form.lastName !== 'string' || !form.lastName.trim())
    return 'lastName is required'
  if (typeof form.phone !== 'string' || !PHONE_RE.test(form.phone))
    return 'phone is invalid'
  if (typeof form.grade !== 'string' || !form.grade.trim())
    return 'grade is required'
  if (requireSchool && (typeof form.school !== 'string' || !form.school.trim()))
    return 'school is required'
  if (requireParentInfo) {
    if (typeof form.parentPhone !== 'string' || !PHONE_RE.test(form.parentPhone))
      return 'parentPhone is invalid'
    if (typeof form.parentName !== 'string' || !form.parentName.trim())
      return 'parentName is required'
  }
  if (requireOlympiadExtras) {
    if (typeof form.region !== 'string' || !form.region.trim())
      return 'region is required'
    if (typeof form.classType !== 'string' || !form.classType.trim())
      return 'classType is required'
    // Teacher info is optional; only validate the phone if one was entered.
    const teacherPhone = typeof form.teacherPhone === 'string' ? form.teacherPhone.trim() : ''
    if (teacherPhone && teacherPhone !== '+996' && !PHONE_RE.test(teacherPhone))
      return 'teacherPhone is invalid'
  }
  return null
}

type PendingPayment = {
  paymentId: string
  table: 'paid_exam_registrations' | 'olympiad_registrations'
  amount: number
  itemName: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const form = (body.form ?? {}) as Record<string, unknown>
  const lang = typeof body.lang === 'string' ? body.lang : 'ru'
  const product = typeof body.product === 'string' ? body.product : 'exam'
  const examId = typeof body.examId === 'string' ? body.examId : ''

  if (product !== 'exam' && product !== 'olympiad') {
    return json({ error: 'Unknown product' }, 400)
  }
  if (product === 'exam' && !examId) return json({ error: 'examId is required' }, 400)

  const FINIK_PAYMENT_URL = Deno.env.get('FINIK_PAYMENT_URL')
  const FINIK_ACCOUNT_ID = Deno.env.get('FINIK_ACCOUNT_ID')
  const FINIK_API_KEY = Deno.env.get('FINIK_API_KEY')
  const FINIK_PRIVATE_KEY = Deno.env.get('FINIK_PRIVATE_KEY')
  const FINIK_WEBHOOK_URL = Deno.env.get('FINIK_WEBHOOK_URL')
  const FINIK_MERCHANT_NAME = Deno.env.get('FINIK_MERCHANT_NAME')
  const FINIK_RETURN_BASE_URL = Deno.env.get('FINIK_RETURN_BASE_URL')
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (
    !FINIK_PAYMENT_URL ||
    !FINIK_ACCOUNT_ID ||
    !FINIK_API_KEY ||
    !FINIK_PRIVATE_KEY ||
    !FINIK_WEBHOOK_URL ||
    !FINIK_RETURN_BASE_URL ||
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {
    return json({ error: 'Payment is not configured (missing env)' }, 500)
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  let pending: PendingPayment

  if (product === 'exam') {
    const { data: exam, error: examError } = await admin
      .from('exams')
      .select('id, title_en, title_ru, is_active, require_parent_info, fee_kgs')
      .eq('id', examId)
      .maybeSingle()

    if (examError || !exam) return json({ error: 'Unknown exam' }, 404)
    if (!exam.is_active) return json({ error: 'This exam is not currently open' }, 403)

    const amount = Number(exam.fee_kgs)
    if (!Number.isFinite(amount) || amount <= 0) {
      return json({ error: 'This exam does not require payment' }, 400)
    }

    const validationError = validateForm(form, !!exam.require_parent_info, false, false)
    if (validationError) return json({ error: validationError }, 400)

    const paymentId = `pe_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`
    const { error: insertError } = await admin.from('paid_exam_registrations').insert({
      id: paymentId,
      exam_id: exam.id,
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      grade: form.grade,
      parent_phone: exam.require_parent_info ? form.parentPhone : null,
      parent_name: exam.require_parent_info ? form.parentName : null,
      lang,
      amount,
      currency: 'KGS',
      payment_status: 'pending',
    })
    if (insertError) return json({ error: 'Could not create registration' }, 500)

    pending = {
      paymentId,
      table: 'paid_exam_registrations',
      amount,
      itemName: exam.title_ru || exam.title_en || 'Оплата регистрации на экзамен',
    }
  } else {
    const { data: settingsRow, error: settingsError } = await admin
      .from('settings')
      .select('value')
      .eq('key', 'olympiad_fee_kgs')
      .maybeSingle()

    if (settingsError) return json({ error: 'Could not read Olympiad price' }, 500)
    const amount = Number.parseInt(settingsRow?.value ?? '', 10)
    if (!Number.isFinite(amount) || amount <= 0) {
      return json({ error: 'Olympiad registration price is not configured' }, 500)
    }

    const validationError = validateForm(form, false, true, true)
    if (validationError) return json({ error: validationError }, 400)

    const paymentId = `oly_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`
    const { error: insertError } = await admin.from('olympiad_registrations').insert({
      id: paymentId,
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      school: form.school,
      grade: form.grade,
      region: form.region,
      class_type: form.classType,
      parent_name: form.parentName,
      parent_phone: form.parentPhone,
      teacher_name: (typeof form.teacherName === 'string' && form.teacherName.trim()) || null,
      teacher_phone:
        (typeof form.teacherPhone === 'string' &&
          form.teacherPhone.trim() !== '+996' &&
          form.teacherPhone.trim()) ||
        null,
      lang,
      amount,
      currency: 'KGS',
      payment_status: 'pending',
    })
    if (insertError) return json({ error: 'Could not create registration' }, 500)

    pending = {
      paymentId,
      table: 'olympiad_registrations',
      amount,
      itemName: 'Регистрация на олимпиаду по математике',
    }
  }

  const url = new URL(FINIK_PAYMENT_URL)
  const timestamp = String(Date.now())
  const apiHeaders = { 'x-api-key': FINIK_API_KEY, 'x-api-timestamp': timestamp }

  const paymentBody = {
    Amount: pending.amount,
    CardType: 'FINIK_QR',
    PaymentId: pending.paymentId,
    RedirectUrl: `${FINIK_RETURN_BASE_URL}/payment/result?paymentId=${pending.paymentId}&type=${product}`,
    Lang: lang,
    Data: {
      accountId: FINIK_ACCOUNT_ID,
      // "Item name" per Finik's validation error — the product being paid
      // for, not the merchant's own name. FINIK_MERCHANT_NAME is unused
      // (left unset); keeping the env var in case Finik wants it elsewhere.
      // Field is literally called name_en in Finik's schema but just holds
      // whatever text we send — Russian here since that's our audience.
      name_en: pending.itemName,
      webhookUrl: FINIK_WEBHOOK_URL,
      description: FINIK_MERCHANT_NAME ?? pending.itemName,
    },
  }

  const signature = sign(
    canonicalString('POST', url.pathname, url.host, apiHeaders, paymentBody),
    FINIK_PRIVATE_KEY,
  )

  try {
    const finikResponse = await fetch(FINIK_PAYMENT_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...apiHeaders, signature },
      body: JSON.stringify(paymentBody),
      redirect: 'manual',
    })

    const redirectUrl = finikResponse.headers.get('location')
    if (finikResponse.status !== 302 || !redirectUrl) {
      const errBody = await finikResponse.text().catch(() => '')
      await admin.from(pending.table).update({ payment_status: 'failed' }).eq('id', pending.paymentId)
      return json(
        { error: `Finik did not return a payment link (${finikResponse.status}): ${errBody}` },
        502,
      )
    }

    return json({ redirectUrl, paymentId: pending.paymentId })
  } catch (err) {
    await admin.from(pending.table).update({ payment_status: 'failed' }).eq('id', pending.paymentId)
    return json({ error: `Could not reach Finik: ${String(err)}` }, 502)
  }
})
