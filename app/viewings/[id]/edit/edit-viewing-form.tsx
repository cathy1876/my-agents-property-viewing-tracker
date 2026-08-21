"use client";

import { useActionState } from "react";
import { updateViewingAction } from "@/lib/actions/viewings";
import { SubmitButton } from "@/components/submit-button";
import { VIEWING_STAGES } from "@/lib/types";
import type { Client, Property, ViewingWithRelations } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/clients";

const initialState: ActionResult = { success: true };

function toDateInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditViewingForm({
  viewing,
  clients,
  properties,
}: {
  viewing: ViewingWithRelations;
  clients: Client[];
  properties: Property[];
}) {
  const action = updateViewingAction.bind(null, viewing.id);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.success === false && state.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Client *</label>
          <select
            name="client_id"
            required
            defaultValue={viewing.client_id}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">
            Property *
          </label>
          <select
            name="property_id"
            required
            defaultValue={viewing.property_id}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.address}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Date *</label>
          <input
            type="date"
            name="appointment_date"
            required
            defaultValue={toDateInput(viewing.appointment_at)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Time *</label>
          <input
            type="time"
            name="appointment_time"
            required
            defaultValue={toTimeInput(viewing.appointment_at)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Stage *</label>
          <select
            name="stage"
            defaultValue={viewing.stage}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {VIEWING_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">
            Agent name *
          </label>
          <input
            name="agent_name"
            required
            defaultValue={viewing.agent_name ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={viewing.notes ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <SubmitButton>Save Changes</SubmitButton>
    </form>
  );
}
