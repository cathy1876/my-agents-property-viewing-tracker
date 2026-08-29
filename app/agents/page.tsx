import Link from "next/link";
import { getAgents } from "@/lib/data/agents";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
        <Link
          href="/agents/new"
          className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New Agent
        </Link>
      </div>

      {agents.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-neutral-500">No agents yet. Add your first agent.</p>
          <Link
            href="/agents/new"
            className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            New Agent
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Agent Code
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Agent Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {agents.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/agents/${a.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {a.agent_code || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {a.agent_email || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
