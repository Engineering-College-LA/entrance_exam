import { supabase } from '../lib/supabase'
import { STAFF_MEMBERS } from '../data/staffData'
import type { StaffMember } from '../types/staff'

export const StaffService = {
  // Fetches published staff from Supabase. Falls back to the local seed data
  // (src/data/staffData.ts) if Supabase isn't configured or the request fails,
  // so the Faculty page never renders empty.
  async list(): Promise<StaffMember[]> {
    if (!supabase) return STAFF_MEMBERS

    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })

    if (error || !data) return STAFF_MEMBERS
    return data as StaffMember[]
  },

  async getBySlug(slug: string): Promise<StaffMember | null> {
    if (!supabase) return STAFF_MEMBERS.find((s) => s.slug === slug) ?? null

    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error || !data) return STAFF_MEMBERS.find((s) => s.slug === slug) ?? null
    return data as StaffMember
  },
}
