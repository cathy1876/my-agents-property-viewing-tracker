import { notFound } from "next/navigation";
import { getViewing } from "@/lib/data/viewings";
import { getClients } from "@/lib/data/clients";
import { getProperties } from "@/lib/data/properties";
import { getAgents } from "@/lib/data/agents";
import { EditViewingForm } from "./edit-viewing-form";

export default async function EditViewingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [viewing, clients, properties, agents] = await Promise.all([
    getViewing(id),
    getClients(),
    getProperties(),
    getAgents(),
  ]);
  if (!viewing) notFound();

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
