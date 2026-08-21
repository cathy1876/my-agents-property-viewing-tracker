import { PropertyForm } from "@/components/property-form";
import { createPropertyAction } from "@/lib/actions/properties";

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        New Property
      </h1>
      <PropertyForm action={createPropertyAction} />
    </div>
  );
}
