"use client";

import { useActionState, useState } from "react";
import { submitViewingUpdateAction } from "@/lib/actions/viewings";
import { SubmitButton } from "@/components/submit-button";
import { VIEWING_OUTCOMES, type ViewingOutcome } from "@/lib/types";
import { OUTCOME_LABEL_MAP } from "@/components/badges";
import type { ActionResult } from "@/lib/actions/clients";

// Starts neither succeeded nor errored, unlike other forms in this app -
// this one doesn't redirect on success, so { success: true } as a starting
// sentinel would show "updated successfully" before any submission.
const initialState: ActionResult = { success: false };

export function UpdateForm({
  id,
  currentOutcome,
  currentFollowUp,
}: {
  id: string;
  currentOutcome: ViewingOutcome | null;
  currentFollowUp: boolean;
}) {
  const action = submitViewingUpdateAction.bind(null, id);
  const [state, formAction] = useActionState(action, initialState);
  const [outcome, setOutcome] = useState<ViewingOutcome | "">(currentOutcome ?? "");
  const [followUp, setFollowUp] = useState(currentFollowUp);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Update this viewing with the selected outcome?")) {
          e.preventDefault();
        }
      }}
      className="space-y-3"
    >
      {state.success === false && state.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.success === true && (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          Viewing updated successfully.
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">
          Outcome *
        </label>
        <select
          name="outcome"
          required
          value={outcome}
          onChange={(e) => {
            const value = e.target.value as ViewingOutcome;
            setOutcome(value);
            if (value === "request_another_viewing") {
              setFollowUp(true);
            }
          }}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select an outcome…
          </option>
          {VIEWING_OUTCOMES.map((o) => (
            <option key={o} value={o}>
              {OUTCOME_LABEL_MAP[o]}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="follow_up"
          checked={followUp}
          onChange={(e) => setFollowUp(e.target.checked)}
          className="rounded border-neutral-300"
        />
        Needs follow-up
      </label>

      <SubmitButton>Update</SubmitButton>
    </form>
  );
}
