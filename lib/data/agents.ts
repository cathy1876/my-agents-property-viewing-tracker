import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/lib/types";

// agent_email is deliberately absent here - it's only ever set once, at
// link time, from the agent's real Supabase Auth email (see
// createAndLinkAgent in lib/data/accounts.ts), and this ordinary
// create/update path must never overwrite it.
export interface AgentInput {
  name: string;
  agent_code?: string | null;
}

export async function getAgents(): Promise<Agent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAgent(id: string): Promise<Agent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createAgentRecord(input: AgentInput): Promise<Agent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agents")
    .insert({
      name: input.name,
      agent_code: input.agent_code || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateAgentRecord(
  id: string,
  input: AgentInput,
): Promise<Agent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agents")
    .update({
      name: input.name,
      agent_code: input.agent_code || null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAgentRecord(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Deactivating blocks that agent's login (RLS's current_agent_id() only
// returns active agents, and the login/middleware guards sign an
// inactive agent's session back out) without touching any of their
// historical Viewings/Clients/Properties, and without deleting the
// agents row itself - reactivating restores access exactly as before.
export async function setAgentActive(
  id: string,
  isActive: boolean,
): Promise<Agent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agents")
    .update({ is_active: isActive })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}
