-- Run as superuser, ONLY if rls_admin_0_diagnose_profile.sql returned no
-- rows. Creates the admin profile row for your account. Safe to run even
-- if unsure - ON CONFLICT makes it a no-op if the row already exists with
-- the same id.

insert into profiles (id, role)
values ('c9b999d2-07bb-4232-abe0-34f82e21be4c', 'admin')
on conflict (id) do update set role = 'admin';

select id, role, created_at
from profiles
where id = 'c9b999d2-07bb-4232-abe0-34f82e21be4c';
-- expect: one row, role = 'admin'
