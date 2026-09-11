import { requireAdmin } from "@/lib/auth/require-admin";
import { getProfilesWithAgents } from "@/lib/data/accounts";
import { LinkAccountForm } from "./link-account-form";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  await requireAdmin();

  const accounts = await getProfilesWithAgents();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        Manage Accounts
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        Create the login itself in the Supabase Dashboard (Authentication →
        Users → Add User), then link it here.
      </p>

      <div className="mb-8 rounded-lg border border-neutral-200 p-5">
        <h2 className="mb-3 text-sm font-medium">Link a new account</h2>
        <LinkAccountForm />
      </div>

      <h2 className="mb-3 text-sm font-medium">Linked accounts</h2>
      {accounts.length === 0 ? (
        <p className="text-sm text-neutral-500">No accounts linked yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  User UUID
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Role
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-neutral-500">
                  Linked Agent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-700">
                    {a.id}
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-700">
                    {a.role}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {a.agent
                      ? `${a.agent.name}${a.agent.agent_code ? ` (${a.agent.agent_code})` : ""}`
                      : "—"}
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
