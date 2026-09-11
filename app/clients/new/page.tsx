import { ClientForm } from "@/components/client-form";
import { createClientAction } from "@/lib/actions/clients";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewClientPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New Client</h1>
      <ClientForm action={createClientAction} />
    </div>
  );
}
