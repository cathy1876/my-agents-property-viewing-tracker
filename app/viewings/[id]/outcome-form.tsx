"use client";

import { useState } from "react";
import { setViewingOutcomeAction } from "@/lib/actions/viewings";
import { SubmitButton } from "@/components/submit-button";
import { VIEWING_OUTCOMES, type ViewingOutcome } from "@/lib/types";
import { OUTCOME_LABEL_MAP } from "@/components/badges";

export function OutcomeForm({
  id,
  currentOutcome,
}: {
  id: string;
  currentOutcome: ViewingOutcome | null;
}) {
  const [value, setValue] = useState<ViewingOutcome | "">(currentOutcome ?? "");

  return (
    <form
      action={async () => {
        if (!value) return;
        await setViewingOutcomeAction(id, value);
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as ViewingOutcome)}
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
      <SubmitButton>Save Outcome</SubmitButton>
    </form>
  );
}
