import { createClient } from "@/lib/supabase/server";
import type {
  Viewing,
  ViewingFilters,
  ViewingOutcome,
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
  notes?: string | null;
}

// Display-only: a "scheduled" viewing whose appointment_at has passed reads
// as "missed" everywhere it's shown, without writing anything to the DB.
// The stored status stays "scheduled" until someone explicitly clicks
// "Mark Missed" (or "Mark Completed") - that button intentionally stays
// enabled so the admin can still commit it on record.
export function getDisplayStatus(
  v: Pick<Viewing, "status" | "appointment_at">,
): ViewingStatus {
  if (v.status === "scheduled" && new Date(v.appointment_at).getTime() < Date.now()) {
    return "missed";
  }
  return v.status;
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
  if (filters.outcome) {
    query = query.eq("outcome", filters.outcome);
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

  let rows = (data ?? []) as unknown as ViewingWithRelations[];

  // Status filter runs after the fetch so it matches on the *displayed*
  // status (e.g. "Missed" includes overdue-but-still-scheduled rows).
  if (filters.status) {
    rows = rows.filter((v) => getDisplayStatus(v) === filters.status);
  }

  return rows;
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
  const updates: { status: ViewingStatus; outcome?: null } = { status };
  // Reopening to scheduled clears any previously recorded outcome.
  if (status === "scheduled" || status === "missed") {
    updates.outcome = null;
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

export async function updateViewingOutcome(
  id: string,
  outcome: ViewingOutcome,
): Promise<Viewing> {
  const supabase = await createClient();
  const updates: { outcome: ViewingOutcome; status: "completed"; follow_up?: true } = {
    outcome,
    status: "completed",
  };
  // Sensible default, not a hard rule: requesting another viewing usually
  // means follow-up is needed. The admin/agent can still uncheck it
  // separately via the follow-up control; other outcomes never touch it.
  if (outcome === "request_another_viewing") {
    updates.follow_up = true;
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
