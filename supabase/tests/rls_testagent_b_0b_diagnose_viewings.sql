-- Diagnostic 2 of 2: run as superuser (no role/JWT switch needed).
-- Shows whether testagent-b has any viewings assigned, and specifically
-- whether at least one is 'scheduled' - block 3 needs a scheduled row to
-- meaningfully exercise the status-change guard (see the lesson learned
-- with testagent-a: an UPDATE that matches zero rows, or matches a row
-- that's already 'completed', looks like "success" without ever
-- triggering the check).

select v.id as viewing_id, v.status, v.outcome, v.appointment_at
from viewings v
join agents a on a.id = v.agent_id
where a.user_id = '70381b7b-7fdd-4b80-b624-466278e9c6d2';
