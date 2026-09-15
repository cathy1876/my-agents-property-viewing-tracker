"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setAgentActive, updateAgentRecord } from "@/lib/data/agents";
import type { ActionResult } from "@/lib/actions/clients";

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
    });
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  revalidatePath("/agents");
  revalidatePath(`/agents/${id}`);
  redirect("/agents?updated=1");
}

export async function toggleAgentActiveAction(
  id: string,
  nextIsActive: boolean,
): Promise<void> {
  await setAgentActive(id, nextIsActive);
  revalidatePath("/agents");
  revalidatePath(`/agents/${id}`);
  redirect(nextIsActive ? "/agents?reactivated=1" : "/agents?deactivated=1");
}
