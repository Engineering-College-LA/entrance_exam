-- Math Olympiad registration now requires payment (Finik.kg), same pattern
-- as paid exams. Existing free-era rows default to 'paid' so they don't
-- show as outstanding in the admin view; new registrations are inserted
-- as 'pending' by the edge function and flipped by the webhook.

alter table public.olympiad_registrations
  add column if not exists amount integer,
  add column if not exists currency text not null default 'KGS',
  add column if not exists payment_status text not null default 'paid'
    check (payment_status in ('pending', 'paid', 'failed')),
  add column if not exists finik_transaction_id text,
  add column if not exists paid_at timestamptz;

-- Registration is now created and confirmed server-side only (payment
-- gating), same boundary as paid_exam_registrations: anon can read/delete
-- (admin dashboard) but never insert or mark its own payment as paid.
revoke insert on public.olympiad_registrations from anon;
drop policy if exists "Allow anon insert olympiad_registrations" on public.olympiad_registrations;

