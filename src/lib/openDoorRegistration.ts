import { supabase } from './supabase'

export async function insertOpenDoorRegistration(
  form: Record<string, string>,
  lang: string,
): Promise<{ error: Error | null }> {
  if (!supabase)
    return { error: new Error('Supabase is not configured (missing env)') }

  const id = String(Date.now())
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
  })

  if (error) return { error: new Error(error.message) }
  return { error: null }
}
