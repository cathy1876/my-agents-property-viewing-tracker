import { notFound } from "next/navigation";
import { getViewing } from "@/lib/data/viewings";
import { getClients } from "@/lib/data/clients";
import { getProperties } from "@/lib/data/properties";
import { getActiveAgents, getAgent } from "@/lib/data/agents";
import { EditViewingForm } from "./edit-viewing-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function EditViewingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [viewing, clients, properties, activeAgents] = await Promise.all([
    getViewing(id),
    getClients(),
    getProperties(),
    getActiveAgents(),
  ]);
  if (!viewing) notFound();

  // The dropdown should only offer active agents, but a viewing already
  // assigned to an agent who's since been deactivated must still show
  // that agent as a selectable option - otherwise just opening Edit to
  // change notes silently forces a reassignment.
  let agents = activeAgents;
  if (viewing.agent_id && !activeAgents.some((a) => a.id === viewing.agent_id)) {
    const currentAgent = await getAgent(viewing.agent_id);
    if (currentAgent) {
      agents = [...activeAgents, currentAgent].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Edit Viewing
      </h1>
      <EditViewingForm
        viewing={viewing}
        clients={clients}
        properties={properties}
        agents={agents}
      />
    </div>
  );
}
