-- Diagnostic: run as superuser (no role/JWT switch needed).
-- Confirms your admin account has a profiles row with role = 'admin' -
-- is_admin() keys off this row, so every admin check below depends on it.

select id, role, created_at
from profiles
where id = 'c9b999d2-07bb-4232-abe0-34f82e21be4c';
-- expect: one row, role = 'admin'
-- if this is empty, run rls_admin_0b_create_profile.sql first
