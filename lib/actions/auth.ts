"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAndLinkAgent, getAuthUserEmail } from "@/lib/data/accounts";

export interface LoginResult {
  success: boolean;
  error?: string;
}

// Supabase Auth returns the same generic error for "wrong password" and
// "no account with that email" (by design - it doesn't want to leak
// which emails are registered). The app can't tell these apart either,
// so every failure shows this one fixed message rather than guessing.
const LOGIN_ERROR =
  "Incorrect email or password. For password reset or account help, contact Support at [Tel. No. XXXXXXXX].";

export async function loginAction(
  _prev: LoginResult,
  formData: FormData,
): Promise<LoginResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { success: false, error: LOGIN_ERROR };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    return { success: false, error: LOGIN_ERROR };
  }

  // A successful Supabase Auth login isn't enough on its own - the
  // account also needs a profiles row (linked by an admin) and, for an
  // agent, an active agents row. Anyone else is signed back out
  // immediately rather than left in a half-logged-in state.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return {
      success: false,
      error:
        "This login hasn't been linked to an account yet. Contact Support at [Tel. No. XXXXXXXX].",
    };
  }

  if (profile.role === "agent") {
    const { data: agent } = await supabase
      .from("agents")
      .select("is_active")
      .eq("user_id", data.user.id)
      .maybeSingle();
    if (!agent || !agent.is_active) {
      await supabase.auth.signOut();
      return {
        success: false,
        error:
          "This account has been deactivated. Contact Support at [Tel. No. XXXXXXXX].",
      };
    }
  }

  redirect("/viewings");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export interface LinkAccountResult {
  success: boolean;
  error?: string;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Admin-only (enforced by RLS on every write below, not just this check) -
// links a Supabase Auth user (created via the Dashboard, since there's no
// service-role key to create logins in-app) to a role. For an admin
// login, that's just a profiles row. For an agent login, this creates
// the agents record and links it in the same step - there's no separate
// "create the agent, then link it later" flow anymore - and stamps
// agent_email from the login's real auth email via auth_user_email(),
// so it's correct from the moment the record exists and never editable
// afterward (see AgentForm).
export async function linkAccountAction(
  _prev: LinkAccountResult,
  formData: FormData,
): Promise<LinkAccountResult> {
  const userId = String(formData.get("user_id") || "").trim();
  const role = String(formData.get("role") || "").trim();

  if (!UUID_RE.test(userId)) {
    return { success: false, error: "Enter a valid user UUID from the Supabase Dashboard." };
  }
  if (role !== "admin" && role !== "agent") {
    return { success: false, error: "Select a role." };
  }

  const supabase = await createClient();

  if (role === "admin") {
    const { error } = await supabase.from("profiles").insert({ id: userId, role });
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath("/admin/accounts");
    return { success: true };
  }

  const name = String(formData.get("name") || "").trim();
  const agentCode = String(formData.get("agent_code") || "").trim() || null;
  if (!name) {
    return { success: false, error: "Enter the agent's name." };
  }

  let email: string | null;
  try {
    email = await getAuthUserEmail(userId);
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
  if (!email) {
    return {
      success: false,
      error: "No Supabase Auth user found for that UUID.",
    };
  }

  let agentId: string;
  try {
    const agent = await createAndLinkAgent({ userId, name, agentCode, email });
    agentId = agent.id;
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: userId, role: "agent" });
  if (profileError) {
    // Roll back the agent record created for this same submission, so a
    // failed link doesn't leave an orphaned, unlinked-but-not-quite
    // agent record behind.
    await supabase.from("agents").delete().eq("id", agentId);
    return { success: false, error: profileError.message };
  }

  revalidatePath("/admin/accounts");
  revalidatePath("/agents");
  return { success: true };
}
