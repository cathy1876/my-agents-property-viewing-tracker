import Link from "next/link";
import { getClients } from "@/lib/data/clients";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <Link
          href="/clients/new"
          className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New Client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-neutral-500">No clients yet. Add your first client.</p>
          <Link
            href="/clients/new"
            className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            New Client
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Phone
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/clients/${c.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{c.email || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
