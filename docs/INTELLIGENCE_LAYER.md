# Intelligence Layer

## Messy Inputs
Viewing notes typed quickly by admin (e.g. "client seemed keen but wants to see again with wife"). No structured intake required in v1 — free-text notes.

## Auto-Structure Schema (later)
```json
{
  "viewing_id": "uuid",
  "suggested_result": "needs_another_viewing",
  "confidence": 0.82,
  "source": "notes-classifier",
  "follow_up_action": "Schedule 2nd viewing within 7 days",
  "key_concerns": ["price", "neighborhood"]
}
```

## Events to Track
- viewing_created, viewing_completed, viewing_missed, result_set

## Scoring Rules (start rule-based)
- **Follow-up urgency** = days since last viewing + result weight:
  - interested_ready_to_commit → urgency = 5 (act within 2 days)
  - needs_another_viewing → urgency = 3 (act within 7 days)
  - not_interested → urgency = 0 (no follow-up)
  - missed (no result) → urgency = 4 (reschedule)
- Score stored in app memory (computed), persisted later as a column.

## What Gets Ranked
Viewings list can sort by follow-up urgency (later). v1 sorts by appointment date.

## v1 vs Later
- **v1:** No AI. Pure rule-based status + result selection.
- **Later:** Note classifier suggests result + follow-up action; agent performance summary.