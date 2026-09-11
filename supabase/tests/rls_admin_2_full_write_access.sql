-- Manual RLS verification for the admin account, run by hand in the
-- Supabase SQL Editor (NOT an app migration).
--
-- Block 2: Admin can insert, update, and manually change status - none of
-- the restrictions that apply to agents should apply here.

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "c9b999d2-07bb-4232-abe0-34f82e21be4c", "role": "authenticated"}';

-- Insert: should succeed (contrast with testagent-a/b's insert being blocked)
insert into viewings (client_id, property_id, agent_id, appointment_at, status)
values (
  (select id from clients limit 1),
  (select id from properties limit 1),
  (select id from agents limit 1),
  now() + interval '1 day',
  'scheduled'
)
returning id, status;
-- expect: 1 row returned, no error

-- Manual status change: should succeed (contrast with testagent-a/b being blocked)
update viewings
set status = 'completed'
where id = (select id from viewings where status = 'scheduled' limit 1)
returning id, status;
-- expect: 1 row returned, no error

rollback;
