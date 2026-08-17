# Data Model

## clients
| field | type | notes |
|-------|------|-------|
| id | uuid pk | |
| user_id | uuid | nullable, for owner-scoping later |
| name | text not null | |
| phone | text | |
| email | text | |
| notes | text | |
| created_at | timestamptz | default now() |

## properties
| field | type | notes |
|-------|------|-------|
| id | uuid pk | |
| user_id | uuid | nullable |
| address | text not null | |
| listing_ref | text | agency reference |
| notes | text | |
| created_at | timestamptz | default now() |

## viewings
| field | type | notes |
|-------|------|-------|
| id | uuid pk | |
| user_id | uuid | nullable |
| client_id | uuid | references clients(id) |
| property_id | uuid | references properties(id) |
| agent_name | text | free text for now |
| appointment_at | timestamptz not null | |
| stage | text not null | '1st' \| '2nd' \| '3rd' |
| status | text not null default 'scheduled' | 'scheduled' \| 'completed' \| 'missed' |
| result | text | 'not_interested' \| 'needs_another_viewing' \| 'interested_ready_to_commit' \| null |
| notes | text | |
| result_summary | text | AI-generated (later); value + source + confidence + review_status |
| result_summary_source | text | |
| result_summary_confidence | numeric | |
| result_summary_review_status | text default 'unreviewed' | |
| created_at | timestamptz | default now() |

## Relationships
- viewing.client_id → clients.id (many viewings per client)
- viewing.property_id → properties.id (many viewings per property)

## RLS (v1 demo-first)
All tables: RLS enabled, permissive read+write for anonymous demo. Lock-down sprint replaces with `auth.uid() = user_id` policies.