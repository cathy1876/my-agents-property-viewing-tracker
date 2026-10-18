"use client";

import { useState } from "react";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; draft: string };

export function DraftFollowUpButton({ viewingId }: { viewingId: string }) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [copied, setCopied] = useState(false);

  async function requestDraft() {
    setState({ status: "loading" });
    setCopied(false);
    try {
      const res = await fetch(`/api/viewings/${viewingId}/draft-followup`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ status: "error", message: data.error || "Something went wrong." });
        return;
      }
      setState({ status: "done", draft: data.draft });
    } catch {
      setState({ status: "error", message: "Network error - please try again." });
    }
  }

  async function copyDraft() {
    if (state.status !== "done") return;
    await navigator.clipboard.writeText(state.draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-4 rounded-lg border border-neutral-200 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium">Draft follow-up message</h2>
        {state.status !== "idle" && (
          <button
            type="button"
            onClick={requestDraft}
            disabled={state.status === "loading"}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
          >
            Draft again
          </button>
        )}
      </div>

      {state.status === "idle" && (
        <button
          type="button"
          onClick={requestDraft}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Draft follow-up message
        </button>
      )}

      {state.status === "loading" && (
        <p className="text-sm text-neutral-500">Drafting…</p>
      )}

      {state.status === "error" && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {state.status === "done" && (
        <div className="space-y-2">
          <div className="whitespace-pre-wrap rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800">
            {state.draft}
          </div>
          <button
            type="button"
            onClick={copyDraft}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
