import Link from "next/link";
import { notFound } from "next/navigation";
import { getViewing } from "@/lib/data/viewings";
import { StatusBadge, ResultBadge } from "@/components/badges";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import {
  deleteViewingAction,
  setViewingFollowUpAction,
  setViewingStatusAction,
} from "@/lib/actions/viewings";
import { SubmitButton } from "@/components/submit-button";
import { ResultForm } from "./result-form";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-ZA", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export default async function ViewingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const viewing = await getViewing(id);
  if (!viewing) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/viewings" className="text-sm text-neutral-500 hover:underline">
            ← Back to viewings
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {formatDateTime(viewing.appointment_at)}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/viewings/${id}/edit`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Edit
          </Link>
          <ConfirmDeleteButton
            action={deleteViewingAction.bind(null, id)}
            confirmMessage="Delete this viewing? This cannot be undone."
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-neutral-200 p-5 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-neutral-500">Client</div>
          {viewing.client ? (
            <Link
              href={`/clients/${viewing.client.id}`}
              className="font-medium text-neutral-900 hover:underline"
            >
              {viewing.client.name}
            </Link>
          ) : (
            <span className="text-neutral-400">—</span>
          )}
          {viewing.client?.phone && (
            <div className="text-sm text-neutral-500">{viewing.client.phone}</div>
          )}
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Property</div>
          {viewing.property ? (
            <Link
              href={`/properties/${viewing.property.id}`}
              className="font-medium text-neutral-900 hover:underline"
            >
              {viewing.property.address}
            </Link>
          ) : (
            <span className="text-neutral-400">—</span>
          )}
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Stage</div>
          <div className="font-medium text-neutral-900">{viewing.stage}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Agent</div>
          {viewing.agent ? (
            <Link
              href={`/agents/${viewing.agent.id}`}
              className="font-medium text-neutral-900 hover:underline"
            >
              {viewing.agent.name}
            </Link>
          ) : (
            <span className="text-neutral-400">—</span>
          )}
          {viewing.agent?.agent_code && (
            <div className="text-sm text-neutral-500">
              {viewing.agent.agent_code}
            </div>
          )}
          {viewing.agent?.agent_email && (
            <div className="text-sm text-neutral-500">
              {viewing.agent.agent_email}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Status</div>
          <div className="mt-1">
            <StatusBadge status={viewing.status} />
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Result</div>
          <div className="mt-1">
            {viewing.status === "completed" ? (
              <ResultBadge result={viewing.result} />
            ) : (
              <span className="text-xs text-neutral-300">—</span>
            )}
          </div>
        </div>
        {viewing.notes && (
          <div className="sm:col-span-2">
            <div className="text-xs font-medium text-neutral-500">Notes</div>
            <div className="whitespace-pre-wrap text-sm text-neutral-700">
              {viewing.notes}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 rounded-lg border border-neutral-200 p-5">
        <h2 className="mb-3 text-sm font-medium">Update status</h2>
        <div className="flex flex-wrap gap-2">
          <form action={setViewingStatusAction.bind(null, id, "completed")}>
            <button
              type="submit"
              disabled={viewing.status === "completed"}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
            >
              Mark Completed
            </button>
          </form>
          <form action={setViewingStatusAction.bind(null, id, "missed")}>
            <button
              type="submit"
              disabled={viewing.status === "missed"}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
            >
              Mark Missed
            </button>
          </form>
          <form action={setViewingStatusAction.bind(null, id, "scheduled")}>
            <button
              type="submit"
              disabled={viewing.status === "scheduled"}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-40"
            >
              Reopen (Scheduled)
            </button>
          </form>
        </div>

        <form
          action={setViewingFollowUpAction.bind(null, id)}
          className="mt-4 flex items-center gap-3 border-t border-neutral-200 pt-4"
        >
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="follow_up"
              defaultChecked={viewing.follow_up}
              className="rounded border-neutral-300"
            />
            Needs follow-up
          </label>
          <SubmitButton className="px-3 py-1.5">Save</SubmitButton>
        </form>
      </div>

      <div id="result" className="rounded-lg border border-neutral-200 p-5">
        <h2 className="mb-3 text-sm font-medium">Set result</h2>
        {viewing.status === "completed" ? (
          <ResultForm id={id} currentResult={viewing.result} />
        ) : (
          <p className="text-sm text-neutral-500">
            Mark this viewing completed to record a result.
          </p>
        )}
      </div>
    </div>
  );
}
