-- Admin/staff can now edit an Olympiad registration's form fields and leave
-- an internal note on it from the dashboard. Editing needs UPDATE, which
-- this table never granted (only select/insert/delete); the note is a
-- simple free-text column, same shape as everything else on this table.

alter table public.olympiad_registrations
  add column if not exists admin_comment text;

grant update on table public.olympiad_registrations to authenticated;

drop policy if exists "Allow authenticated update olympiad_registrations" on public.olympiad_registrations;
create policy "Allow authenticated update olympiad_registrations"
  on public.olympiad_registrations for update
  to authenticated
  using (true)
  with check (true);
