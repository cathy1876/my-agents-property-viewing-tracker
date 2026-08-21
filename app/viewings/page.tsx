import Link from "next/link";
import { getDistinctAgents, getViewings } from "@/lib/data/viewings";
import { StatusBadge, ResultBadge } from "@/components/badges";
import {
  VIEWING_RESULTS,
  VIEWING_STATUSES,
  type ViewingResult,
  type ViewingStatus,
} from "@/lib/types";
import { RESULT_LABEL_MAP } from "@/components/badges";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ViewingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const agent = params.agent || undefined;
  const status = (params.status as ViewingStatus) || undefined;
  const result = (params.result as ViewingResult) || undefined;
  const dateFrom = params.dateFrom || undefined;
  const dateTo = params.dateTo || undefined;
  const needsFollowUp = params.followup === "1";

  const [viewings, agents] = await Promise.all([
    getViewings({ agent, status, result, dateFrom, dateTo, needsFollowUp }),
    getDistinctAgents(),
  ]);

  const hasFilters = agent || status || result || dateFrom || dateTo || needsFollowUp;

  const exportQuery = new URLSearchParams();
  if (agent) exportQuery.set("agent", agent);
  if (status) exportQuery.set("status", status);
  if (result) exportQuery.set("result", result);
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

      <form className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Agent</label>
          <select
            name="agent"
            defaultValue={agent || ""}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
            <option value="">All agents</option>
            {agents.map((a) => (
              <option key={a} value={a}>
                {a}
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
          <label className="text-xs font-medium text-neutral-500">Result</label>
          <select
            name="result"
            defaultValue={result || ""}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
            <option value="">All results</option>
            {VIEWING_RESULTS.map((r) => (
              <option key={r} value={r}>
                {RESULT_LABEL_MAP[r]}
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
                  className="block rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="font-medium text-neutral-900">
                      {formatDateTime(v.appointment_at)}
                    </span>
                    <StatusBadge status={v.status} />
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    <dt className="text-neutral-500">Client</dt>
                    <dd className="text-neutral-700">{v.client?.name ?? "—"}</dd>
                    <dt className="text-neutral-500">Property</dt>
                    <dd className="text-neutral-700">
                      {v.property?.address ?? "—"}
                    </dd>
                    <dt className="text-neutral-500">Stage</dt>
                    <dd className="text-neutral-700">{v.stage}</dd>
                    <dt className="text-neutral-500">Agent</dt>
                    <dd className="text-neutral-700">{v.agent_name ?? "—"}</dd>
                    <dt className="text-neutral-500">Result</dt>
                    <dd>
                      {v.status === "completed" ? (
                        <ResultBadge result={v.result} />
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
                    Appointment
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Client
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Property
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Stage
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Agent
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {viewings.map((v) => (
                  <tr key={v.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/viewings/${v.id}`}
                        className="font-medium text-neutral-900 hover:underline"
                      >
                        {formatDateTime(v.appointment_at)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {v.client?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {v.property?.address ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{v.stage}</td>
                    <td className="px-4 py-3 text-neutral-700">
                      {v.agent_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3">
                      {v.status === "completed" ? (
                        <ResultBadge result={v.result} />
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
