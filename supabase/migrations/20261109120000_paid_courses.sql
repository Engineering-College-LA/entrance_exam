-- Paid courses: a catalog of courses (managed from the admin dashboard) and
-- their registrations. Same payment flow as the Olympiad: the
-- finik-create-payment edge function inserts a 'pending' row with the
-- service role, finik-webhook flips it to 'paid'/'failed'. Public (anon)
-- clients can read active courses and poll their own registration's
-- status, but never insert or update a registration themselves.

create table if not exists public.courses (
  id text primary key,
  title_ru text not null,
  title_en text,
  title_ky text,
  description_ru text,
  description_en text,
  description_ky text,
  fee_kgs integer not null check (fee_kgs > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table public.courses to anon;
grant select, insert, update, delete on table public.courses to authenticated;

drop policy if exists "Allow anon select active courses" on public.courses;
create policy "Allow anon select active courses"
  on public.courses for select
  to anon
  using (is_active);

drop policy if exists "Allow authenticated all courses" on public.courses;
create policy "Allow authenticated all courses"
  on public.courses for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.course_registrations (
  id text primary key,
  course_id text references public.courses (id) on delete set null,
  course_title text,
  first_name text not null,
  last_name text not null,
  phone text not null,
  grade text,
  parent_name text,
  parent_phone text,
  lang text default 'ru',
  amount integer,
  currency text not null default 'KGS',
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),
  finik_transaction_id text,
  paid_at timestamptz,
  admin_comment text,
  registered_at timestamptz not null default now()
);

create index if not exists course_registrations_registered_at_idx
  on public.course_registrations (registered_at desc);
create index if not exists course_registrations_course_id_idx
  on public.course_registrations (course_id);

alter table public.course_registrations enable row level security;

-- anon: select only (the payment result page polls its own row by id).
grant select on table public.course_registrations to anon;
grant select, insert, update, delete on table public.course_registrations to authenticated;

drop policy if exists "Allow anon select course_registrations" on public.course_registrations;
create policy "Allow anon select course_registrations"
  on public.course_registrations for select
  to anon
  using (true);

drop policy if exists "Allow authenticated all course_registrations" on public.course_registrations;
create policy "Allow authenticated all course_registrations"
  on public.course_registrations for all
  to authenticated
  using (true)
  with check (true);

-- Payment result page listens for the webhook's UPDATE in realtime.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.course_registrations;
    exception when duplicate_object then null;
    end;
  end if;
end $$;
