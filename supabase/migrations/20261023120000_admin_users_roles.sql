-- Replaces hardcoded admin/staff credentials in the admin login page with
-- real Supabase Auth accounts. This table maps an auth.users id to a role
-- ("superadmin" or "staff"); the login page checks it after signing in with
-- Supabase Auth to decide what the dashboard unlocks.
--
-- Rows are inserted manually (via the SQL editor, using the Auth user's id)
-- after creating the user in Authentication > Users — there is no client-side
-- insert policy, so a logged-in user cannot grant themselves a role.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('superadmin', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

grant usage on schema public to authenticated;
grant select on table public.admin_users to authenticated;

drop policy if exists "Users can read own admin role" on public.admin_users;
create policy "Users can read own admin role"
  on public.admin_users for select
  to authenticated
  using (auth.uid() = user_id);
