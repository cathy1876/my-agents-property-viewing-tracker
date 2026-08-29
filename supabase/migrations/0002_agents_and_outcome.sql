create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  agent_code text,
  agent_email text,
  created_at timestamptz not null default now()
);

alter table agents enable row level security;

drop policy if exists "agents_v1_read" on agents;
create policy "agents_v1_read" on agents for select using (true);
drop policy if exists "agents_v1_write" on agents;
create policy "agents_v1_write" on agents for all using (true) with check (true);

alter table viewings add column if not exists outcome text;
