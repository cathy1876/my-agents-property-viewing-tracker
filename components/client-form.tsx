"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import type { Client } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/clients";

const initialState: ActionResult = { success: true };

export function ClientForm({
  client,
  action,
}: {
  client?: Client;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.success === false && state.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Name *</label>
        <input
          name="name"
          required
          defaultValue={client?.name ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Phone</label>
        <input
          name="phone"
          defaultValue={client?.phone ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={client?.email ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={client?.notes ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <SubmitButton>{client ? "Save Changes" : "Add Client"}</SubmitButton>
    </form>
  );
}
