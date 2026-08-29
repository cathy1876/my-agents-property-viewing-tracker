"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAgentRecord,
  deleteAgentRecord,
  updateAgentRecord,
} from "@/lib/data/agents";
import type { ActionResult } from "@/lib/actions/clients";

export async function createAgentAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { success: false, error: "Agent name is required." };
  }

  let agentId: string;
  try {
    const agent = await createAgentRecord({
      name,
      agent_code: String(formData.get("agent_code") || "").trim() || null,
      agent_email: String(formData.get("agent_email") || "").trim() || null,
    });
    agentId = agent.id;
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  revalidatePath("/agents");
  redirect(`/agents/${agentId}`);
}

export async function updateAgentAction(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { success: false, error: "Agent name is required." };
  }

  try {
    await updateAgentRecord(id, {
      name,
      agent_code: String(formData.get("agent_code") || "").trim() || null,
      agent_email: String(formData.get("agent_email") || "").trim() || null,
    });
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  revalidatePath("/agents");
  revalidatePath(`/agents/${id}`);
  redirect(`/agents/${id}`);
}

export async function deleteAgentAction(id: string): Promise<void> {
  await deleteAgentRecord(id);
  revalidatePath("/agents");
  redirect("/agents");
}
