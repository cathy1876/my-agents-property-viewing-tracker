import { notFound } from "next/navigation";
import { getProperty } from "@/lib/data/properties";
import { updatePropertyAction } from "@/lib/actions/properties";
import { PropertyForm } from "@/components/property-form";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Edit Property
      </h1>
      <PropertyForm
        property={property}
        action={updatePropertyAction.bind(null, id)}
      />
    </div>
  );
}
