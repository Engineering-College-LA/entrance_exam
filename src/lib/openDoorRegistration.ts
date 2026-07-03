import { supabase } from './supabase'

export async function insertOpenDoorRegistration(
  form: Record<string, string>,
  lang: string,
  eventId?: string,
): Promise<{ error: Error | null; id?: string }> {
  if (!supabase)
    return { error: new Error('Supabase is not configured (missing env)') }

  const id = form.id || String(Date.now())
  const { error } = await supabase.from('open_door_registrations').insert({
    id,
    first_name: form.firstName,
    last_name: form.lastName,
    phone: form.phone,
    grade: form.grade,
    parent_phone: form.parentPhone,
    parent_name: form.parentName,
    attended: null,
    lang,
    registered_at: new Date().toISOString(),
    event_id: eventId || null,
  })

  if (error) return { error: new Error(error.message) }
  return { error: null, id }
}
