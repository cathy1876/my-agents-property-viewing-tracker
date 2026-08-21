"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createClientRecord,
  deleteClientRecord,
  updateClientRecord,
} from "@/lib/data/clients";

export interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

export async function createClientAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { success: false, error: "Client name is required." };
  }

  let clientId: string;
  try {
    const client = await createClientRecord({
      name,
      phone: String(formData.get("phone") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
    });
    clientId = client.id;
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  revalidatePath("/clients");
  revalidatePath("/viewings");
  redirect(`/clients/${clientId}`);
}

export async function updateClientAction(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { success: false, error: "Client name is required." };
  }

  try {
    await updateClientRecord(id, {
      name,
      phone: String(formData.get("phone") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
    });
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  revalidatePath("/viewings");
  redirect(`/clients/${id}`);
}

export async function deleteClientAction(id: string): Promise<void> {
  await deleteClientRecord(id);
  revalidatePath("/clients");
  revalidatePath("/viewings");
  redirect("/clients");
}
