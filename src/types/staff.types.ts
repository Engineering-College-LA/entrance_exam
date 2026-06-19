// Faculty & Staff content model.
// Mirrors the public.staff_members table in Supabase 1:1 (snake_case),
// same approach as ExamQuestion / RegistrationField in src/types/exam.ts.

export type StaffMember = {
  id: string // slug, e.g. "aibek-doolos" — used as primary key
  slug: string // duplicate of id, kept for routing/links: /faculty/[slug]
  full_name_en: string
  full_name_ru: string
  role_en: string
  role_ru: string
  bio_en: string
  bio_ru: string
  department: string | null // free-text tag, e.g. "Cybersecurity", "Student Affairs"
  photo_url: string | null // public Storage URL, null until photo is uploaded/matched
  sort_order: number
  published: boolean
}

// Row shape returned by supabase.from('staff_members').select('*')
export type StaffMemberRow = StaffMember
