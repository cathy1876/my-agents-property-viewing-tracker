import { AgentForm } from "@/components/agent-form";
import { createAgentAction } from "@/lib/actions/agents";

export default function NewAgentPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New Agent</h1>
      <AgentForm action={createAgentAction} />
    </div>
  );
}
