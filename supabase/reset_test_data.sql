-- One-time data wipe, run by hand in the Supabase SQL Editor as superuser
-- (NOT a migration - nothing here is meant to be applied automatically).
--
-- Deletes every row from viewings, clients, properties, and agents so a
-- fresh, clearly-labeled set of test records can be created for Part B
-- testing. Order matters: viewings.agent_id has no ON DELETE clause, so
-- viewings must be cleared before agents or the agent deletes fail with a
-- foreign-key violation (client_id/property_id cascade automatically,
-- but agent_id does not).
--
-- NOTE: this does NOT touch the profiles table or Supabase Auth users.
-- Any profiles row currently linked to an agent (e.g. testagent-a,
-- testagent-b) will become orphaned - its login will fail closed exactly
-- like a deactivated agent, since the agents row it pointed to is gone.
-- Re-link those accounts via /admin/accounts once the new agent records
-- exist, if you want the same test logins to keep working.

begin;

delete from viewings;
delete from clients;
delete from properties;
delete from agents;

select
  (select count(*) from viewings)   as viewings_count,
  (select count(*) from clients)    as clients_count,
  (select count(*) from properties) as properties_count,
  (select count(*) from agents)     as agents_count;
-- expect: all four = 0

commit;
