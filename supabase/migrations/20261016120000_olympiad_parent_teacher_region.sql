-- Olympiad registration now also collects parent contact, teacher contact,
-- and the student's region. Added nullable (not not-null) since the table
-- already has live rows from before these fields existed; the edge
-- function enforces them as required for new submissions.

alter table public.olympiad_registrations
  add column if not exists region text,
  add column if not exists parent_name text,
  add column if not exists parent_phone text,
  add column if not exists teacher_name text,
  add column if not exists teacher_phone text;
