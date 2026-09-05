import type { ViewingOutcome, ViewingStatus } from "@/lib/types";

const STATUS_STYLES: Record<ViewingStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700 ring-blue-600/20",
  completed: "bg-green-50 text-green-700 ring-green-600/20",
  missed: "bg-red-50 text-red-700 ring-red-600/20",
};

// Full-box background per status, for the viewing list cards/rows.
export const STATUS_BOX_STYLES: Record<ViewingStatus, string> = {
  scheduled: "bg-blue-100 border-blue-300 hover:bg-blue-200",
  completed: "bg-green-100 border-green-300 hover:bg-green-200",
  missed: "bg-red-100 border-red-300 hover:bg-red-200",
};

const OUTCOME_STYLES: Record<ViewingOutcome, string> = {
  ready_to_sign: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  request_another_viewing: "bg-amber-50 text-amber-700 ring-amber-600/20",
  dropped_not_interested: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
};

const OUTCOME_LABELS: Record<ViewingOutcome, string> = {
  ready_to_sign: "Ready to sign",
  request_another_viewing: "Request another viewing",
  dropped_not_interested: "Dropped - Not interested",
};

export function StatusBadge({ status }: { status: ViewingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export function OutcomeBadge({ outcome }: { outcome: ViewingOutcome | null }) {
  if (!outcome) {
    return (
      <span className="text-xs text-neutral-400 italic">No outcome set yet</span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${OUTCOME_STYLES[outcome]}`}
    >
      {OUTCOME_LABELS[outcome]}
    </span>
  );
}

export const OUTCOME_LABEL_MAP = OUTCOME_LABELS;
