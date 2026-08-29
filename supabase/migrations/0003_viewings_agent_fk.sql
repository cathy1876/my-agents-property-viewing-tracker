alter table viewings add column if not exists agent_id uuid references agents(id);
alter table viewings drop column if exists agent_name;
