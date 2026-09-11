import { notFound } from "next/navigation";
import { getAgent } from "@/lib/data/agents";
import { updateAgentAction } from "@/lib/actions/agents";
import { AgentForm } from "@/components/agent-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit Agent</h1>
      <AgentForm agent={agent} action={updateAgentAction.bind(null, id)} />
    </div>
  );
}
