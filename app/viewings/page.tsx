import Link from "next/link";
import { getViewings, getDisplayStatus } from "@/lib/data/viewings";
import { getAgents } from "@/lib/data/agents";
import { StatusBadge, OutcomeBadge, STATUS_BOX_STYLES } from "@/components/badges";
import { FormattedDateTime } from "@/components/formatted-date-time";
import {
  VIEWING_OUTCOMES,
  VIEWING_STATUSES,
  type ViewingOutcome,
  type ViewingStatus,
} from "@/lib/types";
import { OUTCOME_LABEL_MAP } from "@/components/badges";

export const dynamic = "force-dynamic";

function FollowUpMarker() {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/30">
      ⚑ Needs follow-up
    </span>
  );
}

export default async function ViewingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const agentId = params.agent || undefined;
  const status = (params.status as ViewingStatus) || undefined;
  const outcome = (params.outcome as ViewingOutcome) || undefined;
  const dateFrom = params.dateFrom || undefined;
  const dateTo = params.dateTo || undefined;
  const needsFollowUp = params.followup === "1";

  const [viewings, agents] = await Promise.all([
    getViewings({ agentId, status, outcome, dateFrom, dateTo, needsFollowUp }),
    getAgents(),
  ]);

  const hasFilters = agentId || status || outcome || dateFrom || dateTo || needsFollowUp;

  const exportQuery = new URLSearchParams();
  if (agentId) exportQuery.set("agent", agentId);
  if (status) exportQuery.set("status", status);
  if (outcome) exportQuery.set("outcome", outcome);
  if (dateFrom) exportQuery.set("dateFrom", dateFrom);
  if (dateTo) exportQuery.set("dateTo", dateTo);
  if (needsFollowUp) exportQuery.set("followup", "1");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Viewings</h1>
        <div className="flex gap-2">
          <a
            href={`/viewings/export?${exportQuery.toString()}`}
            className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Export CSV
          </a>
          <Link
            href="/viewings/new"
            className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            New Viewing
          </Link>
        </div>
      </div>

      <form className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-300 bg-neutral-100 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Agent</label>
          <select
            name="agent"
            defaultValue={agentId || ""}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
            <option value="">All agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Status</label>
          <select
            name="status"
            defaultValue={status || ""}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm capitalize"
          >
            <option value="">All statuses</option>
            {VIEWING_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Outcome</label>
          <select
            name="outcome"
            defaultValue={outcome || ""}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
            <option value="">All outcomes</option>
            {VIEWING_OUTCOMES.map((o) => (
              <option key={o} value={o}>
                {OUTCOME_LABEL_MAP[o]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">From</label>
          <input
            type="date"
            name="dateFrom"
            defaultValue={dateFrom || ""}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">To</label>
          <input
            type="date"
            name="dateTo"
            defaultValue={dateTo || ""}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 pb-1.5 text-sm">
          <input
            type="checkbox"
            name="followup"
            value="1"
            defaultChecked={needsFollowUp}
            className="rounded border-neutral-300"
          />
          Needs follow-up
        </label>
        <button
          type="submit"
          className="rounded-md border border-neutral-300 px-4 py-1.5 text-sm font-medium hover:bg-neutral-50"
        >
          Apply
        </button>
        {hasFilters && (
          <Link
            href="/viewings"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
          >
            Clear filters
          </Link>
        )}
      </form>

      {viewings.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-neutral-500">
            {hasFilters
              ? "No viewings match these filters."
              : "No viewings yet. Create your first viewing."}
          </p>
          {!hasFilters && (
            <Link
              href="/viewings/new"
              className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              New Viewing
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards, one per viewing, showing every field */}
          <ul className="flex flex-col gap-3 md:hidden">
            {viewings.map((v) => (
              <li key={v.id}>
                <Link
                  href={`/viewings/${v.id}`}
                  className={`block rounded-lg border p-4 ${STATUS_BOX_STYLES[getDisplayStatus(v)]}`}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="font-medium text-neutral-900">
                      <FormattedDateTime
                        iso={v.appointment_at}
                        dateStyle="medium"
                        timeStyle="short"
                      />
                    </span>
                    <StatusBadge status={getDisplayStatus(v)} />
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    <dt className="text-neutral-500">Client</dt>
                    <dd className="text-neutral-700">{v.client?.name ?? "—"}</dd>
                    <dt className="text-neutral-500">Property</dt>
                    <dd className="text-neutral-700">
                      {v.property?.address ?? "—"}
                    </dd>
                    <dt className="text-neutral-500">Agent</dt>
                    <dd className="text-neutral-700">{v.agent?.name ?? "—"}</dd>
                    <dt className="text-neutral-500">Agent Code</dt>
                    <dd className="text-neutral-700">
                      {v.agent?.agent_code ?? "—"}
                    </dd>
                    <dt className="text-neutral-500">Agent Email</dt>
                    <dd className="text-neutral-700">
                      {v.agent?.agent_email ?? "—"}
                    </dd>
                    <dt className="text-neutral-500">Outcome</dt>
                    <dd>
                      {v.status === "completed" ? (
                        <OutcomeBadge outcome={v.outcome} />
                      ) : (
                        <span className="text-xs text-neutral-300">—</span>
                      )}
                    </dd>
                    <dt className="text-neutral-500">Follow-up</dt>
                    <dd>
                      {v.follow_up ? (
                        <FollowUpMarker />
                      ) : (
                        <span className="text-xs text-neutral-300">—</span>
                      )}
                    </dd>
                  </dl>
                </Link>
              </li>
            ))}
          </ul>

          {/* Tablet/desktop: full table */}
          <div className="hidden overflow-x-auto rounded-lg border border-neutral-200 md:block">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Scheduled Date
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Client
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Property
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Agent
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Agent Code
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Agent Email
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Outcome
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Follow-up
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {viewings.map((v) => (
                  <tr key={v.id} className={STATUS_BOX_STYLES[getDisplayStatus(v)]}>
                    <td className="px-4 py-3">
                      <Link
                        href={`/viewings/${v.id}`}
                        className="font-medium text-neutral-900 hover:underline"
                      >
                        <FormattedDateTime
                          iso={v.appointment_at}
                          dateStyle="medium"
                          timeStyle="short"
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {v.client?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {v.property?.address ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {v.agent?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {v.agent?.agent_code ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {v.agent?.agent_email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={getDisplayStatus(v)} />
                    </td>
                    <td className="px-4 py-3">
                      {v.status === "completed" ? (
                        <OutcomeBadge outcome={v.outcome} />
                      ) : (
                        <span className="text-xs text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {v.follow_up ? (
                        <FollowUpMarker />
                      ) : (
                        <span className="text-xs text-neutral-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
