import Link from "next/link";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/data/clients";
import { getViewingsForClient } from "@/lib/data/viewings";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { ViewingMiniList } from "@/components/viewing-mini-list";
import { deleteClientAction } from "@/lib/actions/clients";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();
  const viewings = await getViewingsForClient(id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/clients" className="text-sm text-neutral-500 hover:underline">
            ← Back to clients
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {client.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/clients/${id}/edit`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Edit
          </Link>
          <ConfirmDeleteButton
            action={deleteClientAction.bind(null, id)}
            confirmMessage="Delete this client? Their viewings will also be deleted. This cannot be undone."
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-neutral-200 p-5 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-neutral-500">Phone</div>
          <div className="font-medium text-neutral-900">{client.phone || "—"}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-500">Email</div>
          <div className="font-medium text-neutral-900">{client.email || "—"}</div>
        </div>
        {client.notes && (
          <div className="sm:col-span-2">
            <div className="text-xs font-medium text-neutral-500">Notes</div>
            <div className="whitespace-pre-wrap text-sm text-neutral-700">
              {client.notes}
            </div>
          </div>
        )}
      </div>

      <h2 className="mb-3 text-sm font-medium">Viewings</h2>
      <ViewingMiniList viewings={viewings} showProperty />
    </div>
  );
}
