import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgent } from "@/lib/data/agents";
import { AgentActiveToggle } from "@/components/agent-active-toggle";
import { toggleAgentActiveAction } from "@/lib/actions/agents";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AgentStatusBadge } from "@/components/badges";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/agents" className="text-sm text-neutral-500 hover:underline">
            ← Back to agents
          </Link>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight">
            {agent.name}
            <AgentStatusBadge isActive={agent.is_active} />
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/agents/${id}/edit`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Edit
          </Link>
          <AgentActiveToggle
            isActive={agent.is_active}
            action={toggleAgentActiveAction.bind(null, id, !agent.is_active)}
          />
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border border-neutral-200 p-5 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-neutral-500">Agent Code</div>
          <div className="font-medium text-neutral-900">
            {agent.agent_code || "—"}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Agent Email</div>
          <div className="font-medium text-neutral-900">
            {agent.agent_email || "—"}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Login Access</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                agent.is_active
                  ? "bg-green-50 text-green-700 ring-green-600/20"
                  : "bg-neutral-100 text-neutral-600 ring-neutral-500/20"
              }`}
            >
              {agent.is_active ? "Active" : "Deactivated"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
