import { supabase } from './supabase'

export async function getSetting(key: string): Promise<string | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()
    if (error || !data) return null
    return (data as { value: string | null }).value
  } catch {
    return null
  }
}
