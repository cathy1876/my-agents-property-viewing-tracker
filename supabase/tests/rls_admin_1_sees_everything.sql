-- Manual RLS verification for the admin account, run by hand in the
-- Supabase SQL Editor (NOT an app migration).
--
-- Block 1: Admin should see ALL rows, not just rows tied to one agent.
-- Compare the counts here against a superuser "select count(*)" on the
-- same tables (run without the role/JWT switch) - they should match.

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "c9b999d2-07bb-4232-abe0-34f82e21be4c", "role": "authenticated"}';

select count(*) as visible_viewings from viewings;
select count(*) as visible_clients from clients;
select count(*) as visible_properties from properties;
select count(*) as visible_agents from agents;
-- expect: every count matches the true total row count in each table,
-- not just testagent-a's or testagent-b's slice

rollback;
