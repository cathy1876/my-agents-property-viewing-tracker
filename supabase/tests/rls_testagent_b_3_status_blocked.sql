-- Manual RLS verification for testagent-b, run by hand in the Supabase
-- SQL Editor (NOT an app migration - nothing here is meant to be applied
-- automatically or in sequence with supabase/migrations/*).
--
-- Block 3 of 3: Can she manually set Status without going through Outcome? (should fail)
--
-- Run rls_testagent_b_0b_diagnose_viewings.sql first to confirm she has at
-- least one 'scheduled' viewing - if she doesn't, this UPDATE will match
-- zero rows and "succeed" without ever exercising the trigger (same false
-- pass we hit with testagent-a before adding the status filter below).

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "70381b7b-7fdd-4b80-b624-466278e9c6d2", "role": "authenticated"}';

update viewings
set status = 'completed'
where id = (
  select id from viewings
  where agent_id = (select id from agents where user_id = '70381b7b-7fdd-4b80-b624-466278e9c6d2')
    and status = 'scheduled'
  limit 1
);
-- expect: ERROR "Agents cannot manually change status." - that error IS the pass

rollback;
