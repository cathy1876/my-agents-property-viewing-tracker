-- Diagnostic 1 of 2: run as superuser (no role/JWT switch needed).
-- Confirms testagent-a's agent row exists and is active - if this is
-- empty, current_agent_id() returns null for her and every agent-scoped
-- policy fails closed, which would also explain blocks 1 and 2 passing
-- "vacuously" rather than meaningfully.

select id as agent_id, name, is_active, user_id
from agents
where user_id = 'fb9db1e0-39c1-4c93-aaf9-5827e687e06d';
