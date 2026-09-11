-- Manual RLS verification for a deactivated agent, run by hand in the
-- Supabase SQL Editor (NOT an app migration).
--
-- Temporarily flips testagent-b's is_active to false, then checks that
-- her session sees NOTHING - current_agent_id() should return null for a
-- deactivated agent (see the comment in 0007_auth_roles.sql), so every
-- agent-scoped policy fails closed instead of just relying on the app's
-- own session check. Everything happens inside one transaction that
-- rolls back at the end, so testagent-b's is_active flag is never
-- actually changed.

begin;

-- Deactivate her (as superuser, before switching role)
update agents
set is_active = false
where user_id = '70381b7b-7fdd-4b80-b624-466278e9c6d2';

set local role authenticated;
set local request.jwt.claims = '{"sub": "70381b7b-7fdd-4b80-b624-466278e9c6d2", "role": "authenticated"}';

-- Combined into one row/one result set so the SQL Editor (which only
-- displays the last statement's result) shows all four counts at once.
select
  (select count(*) from viewings)  as visible_viewings,
  (select count(*) from clients)   as visible_clients,
  (select count(*) from properties) as visible_properties,
  (select count(*) from agents)    as visible_agents;
-- expect: all four = 0 (not even her own agent row)

rollback;
