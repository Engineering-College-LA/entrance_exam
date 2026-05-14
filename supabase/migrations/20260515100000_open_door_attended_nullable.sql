-- Open Doors form no longer collects "parent attended"; allow NULL on existing databases.
alter table public.open_door_registrations
  alter column attended drop not null;
