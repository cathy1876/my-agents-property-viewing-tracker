import Link from "next/link";
import { notFound } from "next/navigation";
import { getProperty } from "@/lib/data/properties";
import { getViewingsForProperty } from "@/lib/data/viewings";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { ViewingMiniList } from "@/components/viewing-mini-list";
import { deletePropertyAction } from "@/lib/actions/properties";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();
  const viewings = await getViewingsForProperty(id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/properties" className="text-sm text-neutral-500 hover:underline">
            ← Back to properties
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {property.address}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/properties/${id}/edit`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Edit
          </Link>
          <ConfirmDeleteButton
            action={deletePropertyAction.bind(null, id)}
            confirmMessage="Delete this property? Its viewings will also be deleted. This cannot be undone."
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-neutral-200 p-5 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-neutral-500">
            Listing ref
          </div>
          <div className="font-medium text-neutral-900">
            {property.listing_ref || "—"}
          </div>
        </div>
        {property.notes && (
          <div className="sm:col-span-2">
            <div className="text-xs font-medium text-neutral-500">Notes</div>
            <div className="whitespace-pre-wrap text-sm text-neutral-700">
              {property.notes}
            </div>
          </div>
        )}
      </div>

      <h2 className="mb-3 text-sm font-medium">Viewings</h2>
      <ViewingMiniList viewings={viewings} showClient />
    </div>
  );
}
