-- Manual RLS verification for testagent-a, run by hand in the Supabase
-- SQL Editor (NOT an app migration - nothing here is meant to be applied
-- automatically or in sequence with supabase/migrations/*).
--
-- Block 2 of 3: Can she create a viewing? (should fail)

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "fb9db1e0-39c1-4c93-aaf9-5827e687e06d", "role": "authenticated"}';

insert into viewings (client_id, property_id, agent_id, appointment_at, status)
values (
  (select id from clients limit 1),
  (select id from properties limit 1),
  (select id from agents where user_id = 'fb9db1e0-39c1-4c93-aaf9-5827e687e06d'),
  now() + interval '1 day',
  'scheduled'
);
-- expect: ERROR "new row violates row-level security policy" - that error IS the pass

rollback;
