import { notFound } from "next/navigation";
import { getClient } from "@/lib/data/clients";
import { updateClientAction } from "@/lib/actions/clients";
import { ClientForm } from "@/components/client-form";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit Client</h1>
      <ClientForm client={client} action={updateClientAction.bind(null, id)} />
    </div>
  );
}
