import { redirect } from "next/navigation";
import { getSessionProfile, type SessionProfile } from "@/lib/auth/session";

// Used at the top of any page that only Admin should ever reach (create/
// edit forms, the Agents section, account linking) - RLS is the real
// enforcement, this just avoids showing a form to someone who can't
// possibly submit it, or a page they shouldn't see at all.
export async function requireAdmin(): Promise<SessionProfile> {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/viewings");
  }
  return profile;
}
