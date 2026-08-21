export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-6 h-8 w-40 rounded bg-neutral-200" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}
