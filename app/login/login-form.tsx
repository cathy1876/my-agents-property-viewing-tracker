"use client";

import { useActionState } from "react";
import { loginAction, type LoginResult } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";

const initialState: LoginResult = { success: true };

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.success === false && state.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <SubmitButton className="w-full" pendingText="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
