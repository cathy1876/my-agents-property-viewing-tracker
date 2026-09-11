-- Diagnostic 2 of 2: run as superuser (no role/JWT switch needed).
-- Shows whether testagent-a has any viewings assigned at all. If this is
-- empty, block 3's UPDATE has nothing to match, and we'll need to assign
-- her a 'scheduled' viewing first (as superuser) before the trigger test
-- can actually exercise anything.

select v.id as viewing_id, v.status, v.outcome, v.appointment_at
from viewings v
join agents a on a.id = v.agent_id
where a.user_id = 'fb9db1e0-39c1-4c93-aaf9-5827e687e06d';
