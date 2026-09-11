-- Manual RLS verification for testagent-a, run by hand in the Supabase
-- SQL Editor (NOT an app migration - nothing here is meant to be applied
-- automatically or in sequence with supabase/migrations/*).
--
-- Block 1 of 3: Core check - can she only see her own data?
--
-- The SQL Editor normally runs as the superuser role, which bypasses RLS
-- entirely. This switches the session to the "authenticated" role and
-- sets the JWT claim that auth.uid() reads from (what
-- current_agent_id()/is_admin() key off), then rolls back so nothing
-- persists and the role reverts automatically - safe to run as-is.

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "fb9db1e0-39c1-4c93-aaf9-5827e687e06d", "role": "authenticated"}';

select id, client_id, property_id, agent_id, appointment_at, status, outcome
from viewings;              -- expect: only rows where agent_id is hers

select id, name from clients;       -- expect: only clients tied to her own viewings
select id, address from properties; -- expect: only properties tied to her own viewings
select id, name, agent_code from agents; -- expect: only her own agent row, no one else's

rollback;
