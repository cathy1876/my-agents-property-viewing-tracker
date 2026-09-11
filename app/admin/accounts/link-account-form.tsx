"use client";

import { useActionState, useState } from "react";
import { linkAccountAction, type LinkAccountResult } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";

const initialState: LinkAccountResult = { success: false };

export function LinkAccountForm() {
  const [state, formAction] = useActionState(linkAccountAction, initialState);
  const [role, setRole] = useState("agent");

  return (
    <form action={formAction} className="space-y-4">
      {state.success === false && state.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.success === true && (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          Account linked successfully.
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">
          User UUID (from Supabase Dashboard → Authentication → Users)
        </label>
        <input
          name="user_id"
          required
          placeholder="00000000-0000-0000-0000-000000000000"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-mono"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Role</label>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {role === "agent" && (
        <>
          <p className="text-xs text-neutral-500">
            This creates the agent record and links it to the login in one
            step. Email is filled in automatically from the login itself -
            there's no separate email field.
          </p>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Agent Name *
            </label>
            <input
              name="name"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Agent Code
            </label>
            <input
              name="agent_code"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </>
      )}
      <SubmitButton>Link account</SubmitButton>
    </form>
  );
}
