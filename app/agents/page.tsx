import Link from "next/link";
import { getAgents } from "@/lib/data/agents";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AgentStatusBadge } from "@/components/badges";
import { FlashBanner } from "@/components/flash-banner";

export const dynamic = "force-dynamic";

const FLASH_MESSAGES: Record<string, string> = {
  linked: "Agent linked successfully.",
  updated: "Agent updated successfully.",
  deactivated: "Agent deactivated successfully.",
  reactivated: "Agent reactivated successfully.",
};

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const flashParam = params.linked
    ? "linked"
    : params.updated
      ? "updated"
      : params.deactivated
        ? "deactivated"
        : params.reactivated
          ? "reactivated"
          : undefined;
  const agents = await getAgents();

  return (
    <div className="mx-auto max-w-4xl">
      <FlashBanner param={flashParam} pathname="/agents" messages={FLASH_MESSAGES} />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
      </div>

      {agents.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-neutral-500">
            No agents yet. Link one via{" "}
            <Link href="/admin/accounts" className="font-medium text-neutral-900 underline">
              Manage Accounts
            </Link>
            .
          </p>
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
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/agents/${a.id}`}
                        className="font-medium text-neutral-900 hover:underline"
                      >
                        {a.name}
                      </Link>
                      <AgentStatusBadge isActive={a.is_active} />
                    </div>
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
