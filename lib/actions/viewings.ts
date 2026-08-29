"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClientRecord } from "@/lib/data/clients";
import { createPropertyRecord } from "@/lib/data/properties";
import {
  createViewingRecord,
  deleteViewingRecord,
  updateViewingFollowUp,
  updateViewingRecord,
  updateViewingResult,
  updateViewingStatus,
} from "@/lib/data/viewings";
import type { ViewingResult, ViewingStage, ViewingStatus } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/clients";

function toTimestamp(date: string, time: string): string | null {
  if (!date || !time) return null;
  const iso = new Date(`${date}T${time}`);
  if (Number.isNaN(iso.getTime())) return null;
  return iso.toISOString();
}

async function resolveClientId(
  formData: FormData,
): Promise<string | { error: string }> {
  const mode = String(formData.get("client_mode") || "existing");
  if (mode === "new") {
    const name = String(formData.get("new_client_name") || "").trim();
    if (!name) return { error: "New client name is required." };
    const client = await createClientRecord({
      name,
      phone: String(formData.get("new_client_phone") || "").trim() || null,
      email: String(formData.get("new_client_email") || "").trim() || null,
    });
    return client.id;
  }
  const id = String(formData.get("client_id") || "").trim();
  if (!id) return { error: "Please select or create a client." };
  return id;
}

async function resolvePropertyId(
  formData: FormData,
): Promise<string | { error: string }> {
  const mode = String(formData.get("property_mode") || "existing");
  if (mode === "new") {
    const address = String(formData.get("new_property_address") || "").trim();
    if (!address) return { error: "New property address is required." };
    const property = await createPropertyRecord({
      address,
      listing_ref:
        String(formData.get("new_property_listing_ref") || "").trim() || null,
    });
    return property.id;
  }
  const id = String(formData.get("property_id") || "").trim();
  if (!id) return { error: "Please select or create a property." };
  return id;
}

export async function createViewingAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const date = String(formData.get("appointment_date") || "");
  const time = String(formData.get("appointment_time") || "");
  const stage = String(formData.get("stage") || "1st") as ViewingStage;
  const agentId = String(formData.get("agent_id") || "").trim();

  if (!agentId) {
    return { success: false, error: "Agent is required." };
  }

  const appointmentAt = toTimestamp(date, time);
  if (!appointmentAt) {
    return {
      success: false,
      error: "A valid appointment date and time are required.",
    };
  }

  let viewingId: string;
  try {
    const clientId = await resolveClientId(formData);
    if (typeof clientId !== "string") return { success: false, error: clientId.error };

    const propertyId = await resolvePropertyId(formData);
    if (typeof propertyId !== "string")
      return { success: false, error: propertyId.error };

    const viewing = await createViewingRecord({
      client_id: clientId,
      property_id: propertyId,
      agent_id: agentId,
      appointment_at: appointmentAt,
      stage,
      notes: String(formData.get("notes") || "").trim() || null,
    });
    viewingId = viewing.id;
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  revalidatePath("/viewings");
  revalidatePath("/clients");
  revalidatePath("/properties");
  redirect(`/viewings/${viewingId}`);
}

export async function updateViewingAction(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const date = String(formData.get("appointment_date") || "");
  const time = String(formData.get("appointment_time") || "");
  const stage = String(formData.get("stage") || "1st") as ViewingStage;
  const agentId = String(formData.get("agent_id") || "").trim();
  const clientId = String(formData.get("client_id") || "").trim();
  const propertyId = String(formData.get("property_id") || "").trim();

  if (!agentId) return { success: false, error: "Agent is required." };
  if (!clientId || !propertyId)
    return { success: false, error: "Client and property are required." };

  const appointmentAt = toTimestamp(date, time);
  if (!appointmentAt) {
    return {
      success: false,
      error: "A valid appointment date and time are required.",
    };
  }

  try {
    await updateViewingRecord(id, {
      client_id: clientId,
      property_id: propertyId,
      agent_id: agentId,
      appointment_at: appointmentAt,
      stage,
      notes: String(formData.get("notes") || "").trim() || null,
    });
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  revalidatePath("/viewings");
  revalidatePath(`/viewings/${id}`);
  redirect(`/viewings/${id}`);
}

export async function setViewingStatusAction(
  id: string,
  status: ViewingStatus,
): Promise<void> {
  await updateViewingStatus(id, status);
  revalidatePath("/viewings");
  revalidatePath(`/viewings/${id}`);
}

export async function setViewingResultAction(
  id: string,
  result: ViewingResult,
): Promise<void> {
  await updateViewingResult(id, result);
  revalidatePath("/viewings");
  revalidatePath(`/viewings/${id}`);
}

export async function setViewingFollowUpAction(
  id: string,
  formData: FormData,
): Promise<void> {
  const followUp = formData.get("follow_up") === "on";
  await updateViewingFollowUp(id, followUp);
  revalidatePath("/viewings");
  revalidatePath(`/viewings/${id}`);
}

export async function deleteViewingAction(id: string): Promise<void> {
  await deleteViewingRecord(id);
  revalidatePath("/viewings");
  redirect("/viewings");
}
