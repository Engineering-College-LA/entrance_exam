-- Open Doors event registrations (student + parent/guardian). Run in Supabase SQL Editor if migrations are not applied automatically.

create table if not exists public.open_door_registrations (
  id text primary key,
  first_name text not null,
  last_name text not null,
  phone text not null,
  grade text not null,
  parent_phone text not null,
  parent_name text not null,
  attended text,
  lang text default 'ru',
  registered_at timestamptz not null default now()
);

create index if not exists open_door_registrations_registered_at_idx
  on public.open_door_registrations (registered_at desc);

alter table public.open_door_registrations enable row level security;

create policy "Allow anon insert open_door_registrations"
  on public.open_door_registrations for insert
  to anon
  with check (true);

create policy "Allow anon select open_door_registrations"
  on public.open_door_registrations for select
  to anon
  using (true);

create policy "Allow anon delete open_door_registrations"
  on public.open_door_registrations for delete
  to anon
  using (true);
