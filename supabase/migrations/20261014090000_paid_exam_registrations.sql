-- Paid entrance exam registrations (Finik.kg payment). Row is created and
-- transitioned pending -> paid/failed only by the server (service role key);
-- anon has no insert/update grant, so a client can never mark its own
-- payment as paid. Run in Supabase SQL Editor if migrations are not applied
-- automatically.

create table if not exists public.paid_exam_registrations (
  id text primary key, -- our Finik PaymentId / reference
  first_name text not null,
  last_name text not null,
  phone text not null,
  grade text not null,
  parent_phone text not null,
  parent_name text not null,
  lang text default 'ru',
  amount integer not null,
  currency text not null default 'KGS',
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),
  finik_transaction_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists paid_exam_registrations_created_at_idx
  on public.paid_exam_registrations (created_at desc);

alter table public.paid_exam_registrations enable row level security;

grant usage on schema public to anon;
grant select, delete on table public.paid_exam_registrations to anon;

create policy "Allow anon select paid_exam_registrations"
  on public.paid_exam_registrations for select
  to anon
  using (true);

create policy "Allow anon delete paid_exam_registrations"
  on public.paid_exam_registrations for delete
  to anon
  using (true);
