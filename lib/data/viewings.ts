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
// There's no manual "Mark Missed" action - the stored status only ever
// becomes "completed" (via recording an outcome); "missed" is purely
// computed here, never persisted.
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

// Selecting an outcome is the single action that both marks the viewing
// completed and records the outcome - there's no separate "mark completed"
// step. followUp is whatever the admin/agent submitted; any "request
// another viewing implies follow-up" default is applied client-side as a
// pre-filled suggestion, not enforced here.
export async function updateViewingOutcome(
  id: string,
  outcome: ViewingOutcome,
  followUp: boolean,
): Promise<Viewing> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("viewings")
    .update({ outcome, status: "completed", follow_up: followUp })
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
