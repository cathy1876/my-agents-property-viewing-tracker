import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgent } from "@/lib/data/agents";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { deleteAgentAction } from "@/lib/actions/agents";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {agent.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/agents/${id}/edit`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Edit
          </Link>
          <ConfirmDeleteButton
            action={deleteAgentAction.bind(null, id)}
            confirmMessage="Delete this agent? This cannot be undone."
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
      </div>
    </div>
  );
}
