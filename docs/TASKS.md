# Tasks & Sprints

## Sprint 1 — Core Engine (DB + CRUD + Viewing List)
**Goal:** Full viewing CRUD working end-to-end, viewable without login.
- [ ] Create Supabase tables: clients, properties, viewings + seed data
- [ ] `lib/data/` data-access layer (typed CRUD for all three tables)
- [ ] Viewing list page (sort by appointment date, show status/result badges)
- [ ] New viewing form (pick/create client + property inline, date/time, stage, agent name)
- [ ] Viewing detail: mark completed/missed, set result
- [ ] Responsive sidebar nav (Viewings / Clients / Properties)
- [ ] Handle empty state, loading, error on all pages
**DoD:** Admin can create a client, a property, a viewing, mark it completed, set a result, and see it in the list — all persisted and surviving refresh. No login required.

### ← v1 FUNCTIONAL MILESTONE (end of Sprint 1)

## Sprint 2 — Clients & Properties Management
**Goal:** Full CRUD for clients and properties as standalone pages.
- [ ] Clients list + add/edit/delete
- [ ] Properties list + add/edit/delete
- [ ] Link from viewing detail to client/property profile
- [ ] Delete is human-only (confirm dialog)
**DoD:** All three objects are independently manageable; no dead links.

## Sprint 3 — Filtering & Follow-up View
**Goal:** Live status overview for follow-up.
- [ ] Filter viewings by agent, status, result, date range
- [ ] "Needs follow-up" smart filter (scheduled past date, missed, or interested_ready_to_commit)
- [ ] Export viewing list as CSV (replaces spreadsheet)
**DoD:** Admin can pull a live filtered list of all agents' viewing statuses for follow-up.

## Sprint 4 — Lock It Down (Auth + RLS)
**Goal:** Secure app for real single-user use.
- [ ] Supabase Auth (email/password) — login/signup
- [ ] Replace permissive RLS with `auth.uid() = user_id` policies
- [ ] Backfill user_id on existing rows
- [ ] Redirect unauthenticated users to login
**DoD:** Only logged-in admin sees their data; anonymous access blocked.

## Sprint 5 — Intelligence + Agentic (later)
- [ ] Note classifier: suggest result from viewing notes
- [ ] Follow-up task drafting with approval
- [ ] Audit logging on all writes

## Text Gantt
```
S1: ████████ Core engine + viewing CRUD (v1 functional)
S2: ��███     Clients & properties CRUD
S3: ████     Filtering & follow-up + CSV
S4: ████     Auth + RLS lock-down
S5: ████     Intelligence + agentic (later)
```