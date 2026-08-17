# Agentic Layer

## Draftable Actions (low risk — auto, later)
- Suggest viewing result from notes text.
- Draft follow-up task description from result + urgency.
- Tag/score viewings by follow-up priority.

## Executable After Approval (medium risk — later)
- Auto-create a follow-up task row from a draft.
- Update viewing status to "missed" if appointment_at passed and not marked.

## Human-Only (critical)
- Delete any client/property/viewing.
- Edit result once committed.
- Any external message sending (not in scope).

## Named Tools (later)
- `suggest_viewing_result(viewing_id)` → returns suggested result + confidence
- `draft_followup_task(viewing_id)` → returns task description string
- Only these approved tools; never raw execution.

## Audit Log Fields (later)
`id, user_id, action, target_table, target_id, detail_json, created_at`

## v1 vs Later
- **v1:** No agentic actions. All updates are manual admin actions.
- **Later:** Suggest + draft + approved task creation + audit logging.