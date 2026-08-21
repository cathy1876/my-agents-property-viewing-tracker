import Link from "next/link";
import { StatusBadge, ResultBadge } from "@/components/badges";
import type { ViewingWithRelations } from "@/lib/types";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ViewingMiniList({
  viewings,
  showClient,
  showProperty,
}: {
  viewings: ViewingWithRelations[];
  showClient?: boolean;
  showProperty?: boolean;
}) {
  if (viewings.length === 0) {
    return <p className="text-sm text-neutral-500">No viewings yet.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
      {viewings.map((v) => (
        <li key={v.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <Link
              href={`/viewings/${v.id}`}
              className="font-medium text-neutral-900 hover:underline"
            >
              {formatDateTime(v.appointment_at)}
            </Link>
            <div className="truncate text-sm text-neutral-500">
              {showClient && v.client?.name}
              {showClient && showProperty && " · "}
              {showProperty && v.property?.address}
              {(showClient || showProperty) && " · "}
              {v.stage} · {v.agent_name || "—"}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={v.status} />
            {v.status === "completed" && <ResultBadge result={v.result} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
