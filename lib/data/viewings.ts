import { createClient } from "@/lib/supabase/server";
import type {
  Viewing,
  ViewingFilters,
  ViewingResult,
  ViewingStage,
  ViewingStatus,
  ViewingWithRelations,
} from "@/lib/types";

const VIEWING_SELECT =
  "*, client:clients(id, name, phone), property:properties(id, address), agent:agents(id, name, agent_code, agent_email)";

export interface ViewingInput {
  client_id: string;
  property_id: string;
  agent_id: string;
  appointment_at: string;
  stage: ViewingStage;
  notes?: string | null;
}

export async function getViewings(
  filters: ViewingFilters = {},
): Promise<ViewingWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("viewings")
    .select(VIEWING_SELECT)
    .order("appointment_at", { ascending: false });

  if (filters.agentId) {
    query = query.eq("agent_id", filters.agentId);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.result) {
    query = query.eq("result", filters.result);
  }
  if (filters.dateFrom) {
    query = query.gte("appointment_at", filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte("appointment_at", filters.dateTo);
  }
  if (filters.needsFollowUp) {
    query = query.eq("follow_up", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as ViewingWithRelations[];
}

export async function getViewingsForClient(
  clientId: string,
): Promise<ViewingWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewings")
    .select(VIEWING_SELECT)
    .eq("client_id", clientId)
    .order("appointment_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ViewingWithRelations[];
}

export async function getViewingsForProperty(
  propertyId: string,
): Promise<ViewingWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewings")
    .select(VIEWING_SELECT)
    .eq("property_id", propertyId)
    .order("appointment_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ViewingWithRelations[];
}

export async function getViewing(
  id: string,
): Promise<ViewingWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewings")
    .select(VIEWING_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as unknown as ViewingWithRelations | null;
}

export async function createViewingRecord(
  input: ViewingInput,
): Promise<Viewing> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewings")
    .insert({
      client_id: input.client_id,
      property_id: input.property_id,
      agent_id: input.agent_id,
      appointment_at: input.appointment_at,
      stage: input.stage,
      notes: input.notes || null,
      status: "scheduled",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateViewingRecord(
  id: string,
  input: ViewingInput,
): Promise<Viewing> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewings")
    .update({
      client_id: input.client_id,
      property_id: input.property_id,
      agent_id: input.agent_id,
      appointment_at: input.appointment_at,
      stage: input.stage,
      notes: input.notes || null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateViewingStatus(
  id: string,
  status: ViewingStatus,
): Promise<Viewing> {
  const supabase = await createClient();
  const updates: { status: ViewingStatus; result?: null } = { status };
  // Reopening to scheduled clears any previously recorded result.
  if (status === "scheduled" || status === "missed") {
    updates.result = null;
  }
  const { data, error } = await supabase
    .from("viewings")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateViewingResult(
  id: string,
  result: ViewingResult,
): Promise<Viewing> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewings")
    .update({ result, status: "completed" })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateViewingFollowUp(
  id: string,
  followUp: boolean,
): Promise<Viewing> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewings")
    .update({ follow_up: followUp })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteViewingRecord(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("viewings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
