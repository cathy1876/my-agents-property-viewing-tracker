import Link from "next/link";
import { getProperties } from "@/lib/data/properties";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
        <Link
          href="/properties/new"
          className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-neutral-500">
            No properties yet. Add your first property.
          </p>
          <Link
            href="/properties/new"
            className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            New Property
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Address
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Listing Ref
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/properties/${p.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {p.address}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {p.listing_ref || "—"}
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
