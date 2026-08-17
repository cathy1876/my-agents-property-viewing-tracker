# Security

## Secret Handling
- Supabase anon key: public-safe in frontend.
- Supabase service role key: server-only, never in client bundles. Only used in `lib/data/` server functions.
- No other secrets in v1.

## Permission Model
- **v1 (demo-first):** RLS enabled with permissive read+write policies. App works without login. Seed data visible.
- **Lock-down (later sprint):** Replace permissive policies with `auth.uid() = user_id` on all tables. Users see only their own rows.
- Agent (later AI) inherits the logged-in user's permissions — never elevated.

## Approved Tools Rule
Only named server-side functions in `lib/data/` touch the database. No raw SQL in UI components. Later AI tools are explicitly named (`suggest_viewing_result`, `draft_followup_task`) — no generic execute/send.

## Audit Principle
Every meaningful write (create/update viewing, status change, result set) goes through a server action. Later: audit_logs row per action. v1: Supabase row-level timestamps suffice.