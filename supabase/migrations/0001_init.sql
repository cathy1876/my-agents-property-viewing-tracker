create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  address text not null,
  listing_ref text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists viewings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  client_id uuid references clients(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  agent_name text,
  appointment_at timestamptz not null,
  stage text not null default '1st',
  status text not null default 'scheduled',
  result text,
  notes text,
  result_summary text,
  result_summary_source text,
  result_summary_confidence numeric,
  result_summary_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table clients enable row level security;
alter table properties enable row level security;
alter table viewings enable row level security;

drop policy if exists "clients_v1_read" on clients;
create policy "clients_v1_read" on clients for select using (true);
drop policy if exists "clients_v1_write" on clients;
create policy "clients_v1_write" on clients for all using (true) with check (true);

drop policy if exists "properties_v1_read" on properties;
create policy "properties_v1_read" on properties for select using (true);
drop policy if exists "properties_v1_write" on properties;
create policy "properties_v1_write" on properties for all using (true) with check (true);

drop policy if exists "viewings_v1_read" on viewings;
create policy "viewings_v1_read" on viewings for select using (true);
drop policy if exists "viewings_v1_write" on viewings;
create policy "viewings_v1_write" on viewings for all using (true) with check (true);

insert into clients (id, name, phone, email, notes)
values
  ('a1111111-1111-1111-1111-111111111111', 'Jane Doe', '0821234567', 'jane@example.com', 'Looking for 2-bed in Sandton area'),
  ('a2222222-2222-2222-2222-222222222222', 'Thabo Molefe', '0839876543', null, 'Investor, cash buyer'),
  ('a3333333-3333-3333-3333-333333333333', 'Sarah Nkosi', '0715551234', 'sarah@example.com', 'First-time buyer')
on conflict (id) do nothing;

insert into properties (id, address, listing_ref, notes)
values
  ('b1111111-1111-1111-1111-111111111111', '12 Oak Avenue, Sandton', 'JHB-001', '2 bed, 1 bath, secure complex'),
  ('b2222222-2222-2222-2222-222222222222', '45 Main Road, Rosebank', 'JHB-002', '1 bed apartment, close to Gautrain'),
  ('b3333333-3333-3333-3333-333333333333', '8 Sunset Drive, Fourways', 'JHB-003', '3 bed family home, pool')
on conflict (id) do nothing;

insert into viewings (id, client_id, property_id, agent_name, appointment_at, stage, status, result, notes)
values
  ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Sipho Khumalo', now() + interval '1 day', '1st', 'scheduled', null, 'Client requested weekday morning'),
  ('c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'Lerato Dlamini', now() - interval '3 days', '1st', 'completed', 'interested_ready_to_commit', 'Very interested, asked about deposit process'),
  ('c3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'Sipho Khumalo', now() - interval '1 day', '1st', 'missed', null, 'Client did not arrive, no call received'),
  ('c4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 'b3333333-3333-3333-3333-333333333333', 'Lerato Dlamini', now() + interval '5 days', '2nd', 'scheduled', null, 'Second viewing requested after initial interest')
on conflict (id) do nothing;
