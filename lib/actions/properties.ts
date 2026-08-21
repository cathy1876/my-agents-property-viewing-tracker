"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPropertyRecord,
  deletePropertyRecord,
  updatePropertyRecord,
} from "@/lib/data/properties";
import type { ActionResult } from "@/lib/actions/clients";

export async function createPropertyAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const address = String(formData.get("address") || "").trim();
  if (!address) {
    return { success: false, error: "Property address is required." };
  }

  let propertyId: string;
  try {
    const property = await createPropertyRecord({
      address,
      listing_ref: String(formData.get("listing_ref") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
    });
    propertyId = property.id;
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  revalidatePath("/properties");
  revalidatePath("/viewings");
  redirect(`/properties/${propertyId}`);
}

export async function updatePropertyAction(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const address = String(formData.get("address") || "").trim();
  if (!address) {
    return { success: false, error: "Property address is required." };
  }

  try {
    await updatePropertyRecord(id, {
      address,
      listing_ref: String(formData.get("listing_ref") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
    });
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  revalidatePath("/properties");
  revalidatePath(`/properties/${id}`);
  revalidatePath("/viewings");
  redirect(`/properties/${id}`);
}

export async function deletePropertyAction(id: string): Promise<void> {
  await deletePropertyRecord(id);
  revalidatePath("/properties");
  revalidatePath("/viewings");
  redirect("/properties");
}
