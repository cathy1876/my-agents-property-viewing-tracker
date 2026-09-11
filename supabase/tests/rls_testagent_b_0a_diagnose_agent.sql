-- Diagnostic 1 of 2: run as superuser (no role/JWT switch needed).
-- Confirms testagent-b's agent row exists and is active - if this is
-- empty, current_agent_id() returns null for her and every agent-scoped
-- policy fails closed, which would also explain the other blocks passing
-- "vacuously" rather than meaningfully.

select id as agent_id, name, is_active, user_id
from agents
where user_id = '70381b7b-7fdd-4b80-b624-466278e9c6d2';
