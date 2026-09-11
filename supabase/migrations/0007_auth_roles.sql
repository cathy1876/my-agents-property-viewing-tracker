-- Part B: login, two roles (admin/agent), and real Row Level Security.
-- Replaces the wide-open "using (true)" policies from 0001/0002 with
-- policies scoped by role and, for agents, by their own agent_id.

-- ---------------------------------------------------------------------
-- profiles: one row per Supabase Auth login, holding its role. Admin
-- accounts are created manually (see bootstrap note below); agent
-- accounts are linked to an existing agents row via agents.user_id.
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'agent')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- agents: add login-linkage integrity and the deactivate/reactivate flag.
-- user_id already existed (unused, unconstrained) from the original schema.
-- ---------------------------------------------------------------------
alter table agents add column if not exists is_active boolean not null default true;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'agents_user_id_fkey' and table_name = 'agents'
  ) then
    alter table agents
      add constraint agents_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete set null;
  end if;
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'agents_user_id_key' and table_name = 'agents'
  ) then
    alter table agents add constraint agents_user_id_key unique (user_id);
  end if;
end $$;

-- ---------------------------------------------------------------------
-- Helper functions. SECURITY DEFINER so they can read profiles/agents
-- directly (bypassing RLS internally) without policies recursively
-- re-evaluating themselves through these same functions.
-- ---------------------------------------------------------------------
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function current_agent_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  -- A deactivated agent's id is deliberately NOT returned here, so every
  -- policy that compares against current_agent_id() fails closed for
  -- them at the database level - not just in the app's own session check.
  select id from agents where user_id = auth.uid() and is_active = true;
$$;

grant execute on function is_admin() to authenticated;
grant execute on function current_agent_id() to authenticated;

-- ---------------------------------------------------------------------
-- profiles RLS
-- ---------------------------------------------------------------------
alter table profiles enable row level security;

drop policy if exists "profiles_select_own_or_admin" on profiles;
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());

drop policy if exists "profiles_admin_write" on profiles;
create policy "profiles_admin_write" on profiles
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- agents RLS: admin full access; an agent may only read their own row.
-- ---------------------------------------------------------------------
drop policy if exists "agents_v1_read" on agents;
drop policy if exists "agents_v1_write" on agents;
drop policy if exists "agents_select" on agents;
drop policy if exists "agents_admin_write" on agents;

create policy "agents_select" on agents
  for select using (is_admin() or id = current_agent_id());

create policy "agents_admin_write" on agents
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- clients / properties RLS: admin full access; an agent may only read
-- records tied to at least one of their own viewings. No agent write
-- access at all (create/edit/delete is admin-only).
-- ---------------------------------------------------------------------
drop policy if exists "clients_v1_read" on clients;
drop policy if exists "clients_v1_write" on clients;
drop policy if exists "clients_select" on clients;
drop policy if exists "clients_admin_write" on clients;

create policy "clients_select" on clients
  for select using (
    is_admin()
    or exists (
      select 1 from viewings v
      where v.client_id = clients.id and v.agent_id = current_agent_id()
    )
  );

create policy "clients_admin_write" on clients
  for all using (is_admin()) with check (is_admin());

drop policy if exists "properties_v1_read" on properties;
drop policy if exists "properties_v1_write" on properties;
drop policy if exists "properties_select" on properties;
drop policy if exists "properties_admin_write" on properties;

create policy "properties_select" on properties
  for select using (
    is_admin()
    or exists (
      select 1 from viewings v
      where v.property_id = properties.id and v.agent_id = current_agent_id()
    )
  );

create policy "properties_admin_write" on properties
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- viewings RLS: admin full access. An agent may only read/update their
-- own viewings (create/delete stay admin-only - no agent policy for
-- those commands). Column-level restriction (which fields an agent may
-- actually change) is enforced by the trigger below, not by RLS alone.
-- ---------------------------------------------------------------------
drop policy if exists "viewings_v1_read" on viewings;
drop policy if exists "viewings_v1_write" on viewings;
drop policy if exists "viewings_select" on viewings;
drop policy if exists "viewings_admin_all" on viewings;
drop policy if exists "viewings_agent_update_own" on viewings;

create policy "viewings_select" on viewings
  for select using (is_admin() or agent_id = current_agent_id());

create policy "viewings_admin_all" on viewings
  for all using (is_admin()) with check (is_admin());

create policy "viewings_agent_update_own" on viewings
  for update using (agent_id = current_agent_id())
  with check (agent_id = current_agent_id());

-- ---------------------------------------------------------------------
-- Column-level guard: even on their own viewing, a non-admin may only
-- change outcome/follow_up/notes. Status is normally set to 'completed'
-- as an automatic side effect of submitting an outcome (see
-- updateViewingOutcome) - that specific transition is allowed; any other
-- direct status change is not, since status is never manually set by
-- anyone in this app.
-- ---------------------------------------------------------------------
create or replace function enforce_agent_viewing_update()
returns trigger
language plpgsql
as $$
begin
  if is_admin() then
    return new;
  end if;

  if new.client_id is distinct from old.client_id
     or new.property_id is distinct from old.property_id
     or new.agent_id is distinct from old.agent_id
     or new.appointment_at is distinct from old.appointment_at
  then
    raise exception 'Agents may only update outcome, follow_up, and notes.';
  end if;

  if new.status is distinct from old.status then
    if not (
      old.status = 'scheduled'
      and new.status = 'completed'
      and new.outcome is distinct from old.outcome
    ) then
      raise exception 'Agents cannot manually change status.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists viewings_agent_update_guard on viewings;
create trigger viewings_agent_update_guard
  before update on viewings
  for each row
  execute function enforce_agent_viewing_update();
