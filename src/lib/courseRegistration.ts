import { supabase } from './supabase'

export type Course = {
  id: string
  title_ru: string
  title_en: string | null
  title_ky: string | null
  description_ru: string | null
  description_en: string | null
  description_ky: string | null
  fee_kgs: number
  is_active: boolean
  sort_order: number
}

/** Title/description in the current UI language, falling back to Russian. */
export function courseText(course: Course, field: 'title' | 'description', lang: string): string {
  const pick = (l: string) => (course as unknown as Record<string, string | null>)[`${field}_${l}`]
  return pick(lang) || pick('ru') || pick('en') || ''
}

export async function fetchActiveCourses(): Promise<{ courses: Course[] } | { error: Error }> {
  if (!supabase) return { error: new Error('Supabase is not configured (missing env)') }
  const { data, error } = await supabase
    .from('courses')
    .select('id, title_ru, title_en, title_ky, description_ru, description_en, description_ky, fee_kgs, is_active, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) return { error: new Error(error.message) }
  return { courses: (data ?? []) as Course[] }
}

export async function startCoursePayment(
  form: Record<string, string>,
  lang: string,
  courseId: string,
): Promise<{ redirectUrl: string; paymentId: string } | { error: Error }> {
  if (!supabase) return { error: new Error('Supabase is not configured (missing env)') }
  try {
    const { data, error } = await supabase.functions.invoke<{
      redirectUrl?: string
      paymentId?: string
      error?: string
    }>('finik-create-payment', { body: { form, lang, product: 'course', courseId } })

    if (error || !data?.redirectUrl || !data?.paymentId) {
      // Non-2xx responses come back as a generic FunctionsHttpError; our own
      // {error: "..."} body is only reachable via its response context.
      let message = data?.error ?? error?.message ?? 'Could not start payment'
      const context = (error as { context?: Response })?.context
      if (context) {
        const body = await context.json().catch(() => null)
        if (body && typeof body.error === 'string') message = body.error
      }
      return { error: new Error(message) }
    }
    return { redirectUrl: data.redirectUrl, paymentId: data.paymentId }
  } catch {
    return { error: new Error('Could not reach the payment service') }
  }
}
