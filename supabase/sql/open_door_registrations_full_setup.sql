-- =============================================================================
-- Open Doors — полная настройка для Supabase (SQL Editor → New query → Run)
-- После выполнения проверьте .env: VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY
-- =============================================================================

-- Таблица
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

-- Уже созданная таблица могла иметь attended NOT NULL — делаем nullable
alter table public.open_door_registrations
  alter column attended drop not null;

-- Права для роли anon (ключ из «Project Settings → API → anon public»)
grant usage on schema public to anon;
grant select, insert, delete on table public.open_door_registrations to anon;

alter table public.open_door_registrations enable row level security;

-- Пересоздание политик (удобно при повторном запуске скрипта)
drop policy if exists "Allow anon insert open_door_registrations" on public.open_door_registrations;
drop policy if exists "Allow anon select open_door_registrations" on public.open_door_registrations;
drop policy if exists "Allow anon delete open_door_registrations" on public.open_door_registrations;

create policy "Allow anon insert open_door_registrations"
  on public.open_door_registrations
  for insert
  to anon
  with check (true);

create policy "Allow anon select open_door_registrations"
  on public.open_door_registrations
  for select
  to anon
  using (true);

create policy "Allow anon delete open_door_registrations"
  on public.open_door_registrations
  for delete
  to anon
  using (true);

-- =============================================================================
-- Быстрая проверка из SQL Editor (подставьте свой anon JWT или выполните как postgres):
-- select count(*) from public.open_door_registrations;
-- =============================================================================
