-- Math Olympiad (9th grade, for now) registrations. Free registration only,
-- no payment. Mirrors open_door_registrations' RLS shape.

create table if not exists public.olympiad_registrations (
  id text primary key,
  first_name text not null,
  last_name text not null,
  phone text not null,
  school text not null,
  grade text not null,
  lang text default 'ru',
  registered_at timestamptz not null default now()
);

create index if not exists olympiad_registrations_registered_at_idx
  on public.olympiad_registrations (registered_at desc);

alter table public.olympiad_registrations enable row level security;

grant usage on schema public to anon;
grant select, insert, delete on table public.olympiad_registrations to anon;

create policy "Allow anon insert olympiad_registrations"
  on public.olympiad_registrations for insert
  to anon
  with check (true);

create policy "Allow anon select olympiad_registrations"
  on public.olympiad_registrations for select
  to anon
  using (true);

create policy "Allow anon delete olympiad_registrations"
  on public.olympiad_registrations for delete
  to anon
  using (true);
