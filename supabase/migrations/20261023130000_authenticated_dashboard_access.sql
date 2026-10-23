-- The admin dashboard used to run as the `anon` role (hardcoded client-side
-- login). 20261023120000_admin_users_roles.sql switched it to real Supabase
-- Auth, so staff now query as `authenticated` — but paid_exam_registrations,
-- olympiad_registrations, settings, and open_door_registrations only had RLS
-- policies "to anon". Under RLS, a table-level grant alone isn't enough: a
-- policy must also name the querying role, so every dashboard read/write
-- against these four tables was being silently denied for staff, while still
-- working for the public-facing anon registration/payment forms. This mirrors
-- the existing anon grants/policies for authenticated.

grant usage on schema public to authenticated;

grant select, delete on table public.paid_exam_registrations to authenticated;

create policy "Allow authenticated select paid_exam_registrations"
  on public.paid_exam_registrations for select
  to authenticated
  using (true);

create policy "Allow authenticated delete paid_exam_registrations"
  on public.paid_exam_registrations for delete
  to authenticated
  using (true);

grant select, insert, delete on table public.olympiad_registrations to authenticated;

create policy "Allow authenticated insert olympiad_registrations"
  on public.olympiad_registrations for insert
  to authenticated
  with check (true);

create policy "Allow authenticated select olympiad_registrations"
  on public.olympiad_registrations for select
  to authenticated
  using (true);

create policy "Allow authenticated delete olympiad_registrations"
  on public.olympiad_registrations for delete
  to authenticated
  using (true);

grant select, insert, update on table public.settings to authenticated;

create policy "Allow authenticated select settings"
  on public.settings for select
  to authenticated
  using (true);

create policy "Allow authenticated insert settings"
  on public.settings for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update settings"
  on public.settings for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated insert open_door_registrations"
  on public.open_door_registrations for insert
  to authenticated
  with check (true);

create policy "Allow authenticated select open_door_registrations"
  on public.open_door_registrations for select
  to authenticated
  using (true);

create policy "Allow authenticated delete open_door_registrations"
  on public.open_door_registrations for delete
  to authenticated
  using (true);
