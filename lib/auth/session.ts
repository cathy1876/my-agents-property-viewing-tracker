import { createClient } from "@/lib/supabase/server";

export interface SessionProfile {
  userId: string;
  email: string | null;
  role: "admin" | "agent";
  agentId: string | null;
  agentName: string | null;
}

// Resolves the logged-in user's role and, for agents, the specific
// agents row they're linked to. Returns null for anyone who isn't a
// real, provisioned, active account - an authenticated Supabase user
// with no profiles row (not yet linked by an admin), or an agent whose
// agents.is_active has been turned off, is treated as fully logged out
// here rather than as a degraded session, matching current_agent_id()'s
// same fail-closed behavior in RLS.
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return null;

  if (profile.role === "admin") {
    return {
      userId: user.id,
      email: user.email ?? null,
      role: "admin",
      agentId: null,
      agentName: null,
    };
  }

  const { data: agent } = await supabase
    .from("agents")
    .select("id, name, is_active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!agent || !agent.is_active) return null;

  return {
    userId: user.id,
    email: user.email ?? null,
    role: "agent",
    agentId: agent.id,
    agentName: agent.name,
  };
}
