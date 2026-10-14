-- Lets an admin mark any exam as requiring payment (via the existing Exams
-- admin tab) instead of a bespoke settings toggle, and links a payment back
-- to the exam it unlocks.

alter table public.exams
  add column if not exists fee_kgs integer;

alter table public.paid_exam_registrations
  add column if not exists exam_id text references public.exams(id);

-- A linked exam may not require parent info (exams.require_parent_info),
-- so these can no longer be unconditionally required at the DB level.
alter table public.paid_exam_registrations
  alter column parent_phone drop not null,
  alter column parent_name drop not null;
