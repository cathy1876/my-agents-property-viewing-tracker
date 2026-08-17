# Test Plan — v1

## Success Scenario (manual)
1. Open app (no login) → Viewings list loads with seed rows visible.
2. Click "New Viewing" → form appears.
3. Create new client (Jane Doe, 0821234567) inline.
4. Create new property (12 Oak Ave, Sandton) inline.
5. Set appointment tomorrow 10:00, stage = 1st, agent = Sipho. Save.
6. New viewing appears in list with status=scheduled.
7. Click the viewing → mark Completed → set result = interested_ready_to_commit. Save.
8. List row updates: status badge=completed, result badge=interested.
9. Refresh browser → row still shows completed/interested.

## Empty State
- Delete all viewings (or fresh DB) → list shows "No viewings yet. Create your first viewing." with a CTA button.

## Error State
- Supabase unreachable → list shows "Could not load viewings. Check connection and retry." with retry button.
- Submit new viewing without client name → form shows validation error, nothing saved.

## Loading State
- Pages show skeleton/spinner while fetching; no flash of empty content.

## Partial State
- Viewing with status=completed but no result → result cell shows "No result set yet" with a link to add it.

## Persistence Check
- Create viewing → refresh → data identical. Truth is server-derived.