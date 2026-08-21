import { getClients } from "@/lib/data/clients";
import { getProperties } from "@/lib/data/properties";
import { NewViewingForm } from "./new-viewing-form";

export default async function NewViewingPage() {
  const [clients, properties] = await Promise.all([
    getClients(),
    getProperties(),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        New Viewing
      </h1>
      <NewViewingForm clients={clients} properties={properties} />
    </div>
  );
}
