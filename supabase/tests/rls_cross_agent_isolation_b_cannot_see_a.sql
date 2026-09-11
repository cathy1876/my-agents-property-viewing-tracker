-- Cross-agent isolation check, run by hand in the Supabase SQL Editor.
-- Confirms testagent-b cannot see testagent-a's viewings, even when he
-- explicitly filters for them by agent_id - RLS should make those rows
-- invisible outright, not just "not returned by default".

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "70381b7b-7fdd-4b80-b624-466278e9c6d2", "role": "authenticated"}';

select v.id, v.agent_id, v.status
from viewings v
where v.agent_id = (
  select id from agents where user_id = 'fb9db1e0-39c1-4c93-aaf9-5827e687e06d'
);
-- expect: 0 rows - testagent-b's session cannot see testagent-a's viewings at all

rollback;
