import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export interface ProfileWithAgent extends Profile {
  agent: { id: string; name: string; agent_code: string | null } | null;
}

// The app has no service-role key, so it can't read auth.users (email,
// etc.) via PostgREST - only the linked profiles/agents rows are visible.
// Admin identifies accounts by the UUID shown in the Supabase Dashboard.
export async function getProfilesWithAgents(): Promise<ProfileWithAgent[]> {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const { data: agents, error: agentsError } = await supabase
    .from("agents")
    .select("id, name, agent_code, user_id")
    .not("user_id", "is", null);
  if (agentsError) throw new Error(agentsError.message);

  const agentByUserId = new Map(
    (agents ?? []).map((a) => [a.user_id as string, a]),
  );

  return (profiles ?? []).map((p) => ({
    ...p,
    agent: agentByUserId.get(p.id)
      ? {
          id: agentByUserId.get(p.id)!.id,
          name: agentByUserId.get(p.id)!.name,
          agent_code: agentByUserId.get(p.id)!.agent_code,
        }
      : null,
  }));
}

// Reads a Supabase Auth user's email via the auth_user_email() SECURITY
// DEFINER function - the app has no service-role key, so this is the only
// way to see auth.users at all, and the function itself refuses to return
// anything unless the caller is an admin.
export async function getAuthUserEmail(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("auth_user_email", {
    target_user_id: userId,
  });
  if (error) throw new Error(error.message);
  return (data as string | null) ?? null;
}

export interface CreateAndLinkAgentInput {
  userId: string;
  name: string;
  agentCode: string | null;
  email: string;
}

// Creates the agents row and links it to a login in one step - agent_email
// is set here, once, from the real auth email, and is never touched again
// by the ordinary agent edit form (see AgentForm/updateAgentAction).
export async function createAndLinkAgent(
  input: CreateAndLinkAgentInput,
): Promise<{ id: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agents")
    .insert({
      name: input.name,
      agent_code: input.agentCode,
      agent_email: input.email,
      user_id: input.userId,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data;
}
