-- Generic key/value settings table. Already in use in production for
-- "olympiad_fee_kgs" (set via the admin dashboard); this migration just
-- documents its shape for fresh environments and adds the countdown date
-- used on the student profile page, editable from the admin dashboard.

create table if not exists public.settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

grant usage on schema public to anon;
grant select, insert, update on table public.settings to anon;

drop policy if exists "Allow anon select settings" on public.settings;
create policy "Allow anon select settings"
  on public.settings for select
  to anon
  using (true);

drop policy if exists "Allow anon upsert settings" on public.settings;
create policy "Allow anon upsert settings"
  on public.settings for insert
  to anon
  with check (true);

drop policy if exists "Allow anon update settings" on public.settings;
create policy "Allow anon update settings"
  on public.settings for update
  to anon
  using (true)
  with check (true);

-- Default countdown target shown on the profile page until an admin
-- changes it. "November 31" doesn't exist, so this defaults to Nov 30.
insert into public.settings (key, value)
values ('exam_countdown_at', '2026-11-30T00:00:00+06:00')
on conflict (key) do nothing;
