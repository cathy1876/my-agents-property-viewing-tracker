-- Manual RLS verification for testagent-b, run by hand in the Supabase
-- SQL Editor (NOT an app migration - nothing here is meant to be applied
-- automatically or in sequence with supabase/migrations/*).
--
-- Block 1 of 3: Core check - can she only see her own data?

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "70381b7b-7fdd-4b80-b624-466278e9c6d2", "role": "authenticated"}';

select id, client_id, property_id, agent_id, appointment_at, status, outcome
from viewings;              -- expect: only rows where agent_id is hers

select id, name from clients;       -- expect: only clients tied to her own viewings
select id, address from properties; -- expect: only properties tied to her own viewings
select id, name, agent_code from agents; -- expect: only her own agent row, no one else's

rollback;
