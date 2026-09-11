-- Manual RLS verification for testagent-a, run by hand in the Supabase
-- SQL Editor (NOT an app migration - nothing here is meant to be applied
-- automatically or in sequence with supabase/migrations/*).
--
-- Block 3 of 3: Can she manually set Status without going through Outcome? (should fail)

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "fb9db1e0-39c1-4c93-aaf9-5827e687e06d", "role": "authenticated"}';

update viewings
set status = 'completed'
where id = (
  select id from viewings
  where agent_id = (select id from agents where user_id = 'fb9db1e0-39c1-4c93-aaf9-5827e687e06d')
    and status = 'scheduled'
  limit 1
);
-- Targets a 'scheduled' row specifically (not just "any of her viewings") so
-- the update is a genuine scheduled->completed transition without touching
-- outcome - the one case the trigger must reject.
-- expect: ERROR "Agents cannot manually change status." - that error IS the pass

rollback;
