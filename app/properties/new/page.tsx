import { PropertyForm } from "@/components/property-form";
import { createPropertyAction } from "@/lib/actions/properties";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewPropertyPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        New Property
      </h1>
      <PropertyForm action={createPropertyAction} />
    </div>
  );
}
