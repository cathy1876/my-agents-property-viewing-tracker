"use client";

export default function ViewingsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-lg border border-dashed border-red-300 py-16 text-center">
      <p className="text-red-600">
        Could not load viewings. Check connection and retry.
      </p>
      <button
        onClick={reset}
        className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
      >
        Retry
      </button>
    </div>
  );
}
