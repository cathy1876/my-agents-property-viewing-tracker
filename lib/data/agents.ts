import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/lib/types";

export interface AgentInput {
  name: string;
  agent_code?: string | null;
  agent_email?: string | null;
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
      agent_email: input.agent_email || null,
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
      agent_email: input.agent_email || null,
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
