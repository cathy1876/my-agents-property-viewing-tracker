import Link from "next/link";
import { notFound } from "next/navigation";
import { getDisplayStatus, getViewing } from "@/lib/data/viewings";
import { StatusBadge, OutcomeBadge } from "@/components/badges";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { deleteViewingAction } from "@/lib/actions/viewings";
import { FormattedDateTime } from "@/components/formatted-date-time";
import { FlashBanner } from "@/components/flash-banner";
import { UpdateForm } from "./update-form";

export default async function ViewingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { id } = await params;
  const { updated } = await searchParams;
  const viewing = await getViewing(id);
  if (!viewing) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <FlashBanner param={updated ? "updated" : undefined} pathname={`/viewings/${id}`} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/viewings" className="text-sm text-neutral-500 hover:underline">
            ← Back to viewings
          </Link>
          <div className="mt-1 text-xs font-medium text-neutral-500">
            Scheduled Date
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            <FormattedDateTime
              iso={viewing.appointment_at}
              dateStyle="full"
              timeStyle="short"
            />
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
            <StatusBadge status={getDisplayStatus(viewing)} />
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Outcome</div>
          <div className="mt-1">
            {viewing.status === "completed" ? (
              <OutcomeBadge outcome={viewing.outcome} />
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

      <div className="rounded-lg border border-neutral-200 p-5">
        <h2 className="mb-1 text-sm font-medium">Update</h2>
        <p className="mb-3 text-sm text-neutral-500">
          Selecting an outcome marks this viewing completed and records the
          outcome in one step.
        </p>
        <UpdateForm
          id={id}
          currentOutcome={viewing.outcome}
          currentFollowUp={viewing.follow_up}
        />
      </div>
    </div>
  );
}
