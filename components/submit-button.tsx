"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "",
  pendingText = "Saving…",
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
