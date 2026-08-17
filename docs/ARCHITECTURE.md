# Architecture

## Stack
Next.js (App Router) + Supabase (Postgres) + Vercel.

## Build Now vs Later
- **Now:** Client/Property/Viewing CRUD, viewing list with filters, status + result updates.
- **Later:** Auth + per-user RLS lock-down, smart viewing-result summaries, follow-up task drafts, agent performance dashboard.

## Key User Action Flow
1. Admin opens app (no login) → sees Viewings list with seed rows.
2. Clicks "New Viewing" → picks/creates client, picks/creates property, fills date/time, stage, agent name.
3. Saves → row appears in list.
4. Later: opens the viewing → marks completed/missed → selects result.
5. List reflects updated status; filter by agent/status/result for follow-up.

## Responsive Nav Shell
Persistent left sidebar on desktop (Viewings, Clients, Properties); collapses to hamburger on mobile. Current section highlighted.

## Layer Plan
1. **Data layer** — `lib/data/` all Supabase reads/writes, typed functions.
2. **App logic** — server actions for create/update viewing.
3. **UI** — feature folders: viewings/, clients/, properties/.
4. **Smart features (later)** — `lib/ai/` summaries and follow-up suggestions.

## Why Core Works Without AI
Every action is plain CRUD on deterministic tables. AI summaries/suggestions layer on later as convenience — removing them changes nothing about data integrity.

## Repo Structure
```
lib/data/          # data-access layer (all DB calls)
lib/ai/            # intelligence (later)
app/viewings/      # list + detail + new
app/clients/       # list + new
app/properties/    # list + new
components/        # shared UI
tests/             # beside features
```

## Module Map
| Module | Responsibility | Owns | Build Order |
|--------|---------------|------|-------------|
| data | All DB reads/writes | clients, properties, viewings | 1 |
| viewings | List, create, update status/result | viewing UI + actions | 2 |
| clients | Client CRUD | client UI + form | 3 |
| properties | Property CRUD | property UI + form | 3 |
| ai | Result summaries, follow-up suggestions (later) | prompts + scoring | 4 |