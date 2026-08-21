"use client";

import { useActionState, useState } from "react";
import { createViewingAction } from "@/lib/actions/viewings";
import { SubmitButton } from "@/components/submit-button";
import { VIEWING_STAGES } from "@/lib/types";
import type { Client } from "@/lib/types";
import type { Property } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/clients";

const initialState: ActionResult = { success: true };

export function NewViewingForm({
  clients,
  properties,
}: {
  clients: Client[];
  properties: Property[];
}) {
  const [state, formAction] = useActionState(createViewingAction, initialState);
  const [clientMode, setClientMode] = useState<"existing" | "new">(
    clients.length === 0 ? "new" : "existing",
  );
  const [propertyMode, setPropertyMode] = useState<"existing" | "new">(
    properties.length === 0 ? "new" : "existing",
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.success === false && state.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4">
        <legend className="px-1 text-sm font-medium">Client</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="client_mode"
              value="existing"
              checked={clientMode === "existing"}
              onChange={() => setClientMode("existing")}
            />
            Existing client
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="client_mode"
              value="new"
              checked={clientMode === "new"}
              onChange={() => setClientMode("new")}
            />
            New client
          </label>
        </div>
        {clientMode === "existing" ? (
          <select
            name="client_id"
            required
            defaultValue=""
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select a client…
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.phone ? `(${c.phone})` : ""}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="new_client_name"
              placeholder="Full name *"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              name="new_client_phone"
              placeholder="Phone"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              name="new_client_email"
              placeholder="Email"
              type="email"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4">
        <legend className="px-1 text-sm font-medium">Property</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="property_mode"
              value="existing"
              checked={propertyMode === "existing"}
              onChange={() => setPropertyMode("existing")}
            />
            Existing property
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="property_mode"
              value="new"
              checked={propertyMode === "new"}
              onChange={() => setPropertyMode("new")}
            />
            New property
          </label>
        </div>
        {propertyMode === "existing" ? (
          <select
            name="property_id"
            required
            defaultValue=""
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select a property…
            </option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.address}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="new_property_address"
              placeholder="Address *"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              name="new_property_listing_ref"
              placeholder="Listing ref"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4">
        <legend className="px-1 text-sm font-medium">Appointment</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Date *
            </label>
            <input
              type="date"
              name="appointment_date"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Time *
            </label>
            <input
              type="time"
              name="appointment_time"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Stage *
            </label>
            <select
              name="stage"
              defaultValue="1st"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
              {VIEWING_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">
            Agent name *
          </label>
          <input
            name="agent_name"
            required
            placeholder="e.g. Sipho Khumalo"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </fieldset>

      <SubmitButton>Create Viewing</SubmitButton>
    </form>
  );
}
