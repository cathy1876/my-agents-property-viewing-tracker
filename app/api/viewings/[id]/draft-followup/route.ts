import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth/session";
import { getViewing } from "@/lib/data/viewings";
import { draftFollowUpMessage, FollowUpDraftError } from "@/lib/ai/followup";

// Admin-only, server-side. The page only renders the button for admins,
// but that's UI, not security - this re-checks the session role itself
// before calling out to OpenRouter, so an agent hitting this URL directly
// still gets rejected.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const viewing = await getViewing(id);
  if (!viewing) {
    return NextResponse.json({ error: "Viewing not found." }, { status: 404 });
  }
  if (viewing.outcome !== "request_another_viewing") {
    return NextResponse.json(
      { error: "This viewing's outcome is not 'Request another viewing'." },
      { status: 400 },
    );
  }
  if (!viewing.client || !viewing.property || !viewing.agent) {
    return NextResponse.json(
      { error: "This viewing is missing a client, property, or agent." },
      { status: 400 },
    );
  }

  try {
    const draft = await draftFollowUpMessage({
      clientName: viewing.client.name,
      propertyAddress: viewing.property.address,
      appointmentAt: viewing.appointment_at,
      notes: viewing.notes,
      agentName: viewing.agent.name,
    });
    return NextResponse.json({ draft });
  } catch (err) {
    const message =
      err instanceof FollowUpDraftError ? err.message : "Could not draft a message. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
