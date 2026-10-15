import { supabase } from './supabase'

const CACHE_PREFIX = 'ec_olympiad_student_'

/** Student form survives the round-trip to Finik's hosted page and back. */
function cacheOlympiadStudent(paymentId: string, form: Record<string, string>): void {
  try {
    localStorage.setItem(CACHE_PREFIX + paymentId, JSON.stringify(form))
  } catch {
    /* ignore */
  }
}

export function readCachedOlympiadStudent(paymentId: string): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + paymentId)
    if (!raw) return null
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return null
  }
}

export async function startOlympiadPayment(
  form: Record<string, string>,
  lang: string,
): Promise<{ redirectUrl: string; paymentId: string } | { error: Error }> {
  if (!supabase) return { error: new Error('Supabase is not configured (missing env)') }
  try {
    const { data, error } = await supabase.functions.invoke<{
      redirectUrl?: string
      paymentId?: string
      error?: string
    }>('finik-create-payment', { body: { form, lang, product: 'olympiad' } })

    if (error || !data?.redirectUrl || !data?.paymentId) {
      // Edge Functions report a non-2xx response as a generic FunctionsHttpError;
      // our own {error: "..."} body is only reachable via its response context.
      let message = data?.error ?? error?.message ?? 'Could not start payment'
      const context = (error as { context?: Response })?.context
      if (context) {
        const body = await context.json().catch(() => null)
        if (body && typeof body.error === 'string') message = body.error
      }
      return { error: new Error(message) }
    }
    cacheOlympiadStudent(data.paymentId, form)
    return { redirectUrl: data.redirectUrl, paymentId: data.paymentId }
  } catch {
    return { error: new Error('Could not reach the payment service') }
  }
}
