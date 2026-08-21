"use client";

import { useState } from "react";
import { setViewingResultAction } from "@/lib/actions/viewings";
import { SubmitButton } from "@/components/submit-button";
import { VIEWING_RESULTS, type ViewingResult } from "@/lib/types";
import { RESULT_LABEL_MAP } from "@/components/badges";

export function ResultForm({
  id,
  currentResult,
}: {
  id: string;
  currentResult: ViewingResult | null;
}) {
  const [value, setValue] = useState<ViewingResult | "">(currentResult ?? "");

  return (
    <form
      action={async () => {
        if (!value) return;
        await setViewingResultAction(id, value);
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as ViewingResult)}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Select a result…
        </option>
        {VIEWING_RESULTS.map((r) => (
          <option key={r} value={r}>
            {RESULT_LABEL_MAP[r]}
          </option>
        ))}
      </select>
      <SubmitButton>Save Result</SubmitButton>
    </form>
  );
}
