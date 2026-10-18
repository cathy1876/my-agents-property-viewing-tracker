// Server-only. Never import this file from a "use client" component -
// it reads OPENROUTER_API_KEY from process.env, which must not reach the
// browser bundle.
//
// ── Everything you'd want to tweak about the wording lives here ──────────
export const FOLLOW_UP_MODEL = "openai/gpt-4o-mini";

export const FOLLOW_UP_INSTRUCTIONS = `You draft short WhatsApp follow-up messages for a real estate admin clerk to send to a client, on behalf of the assigned agent.

Rules:
- Write in English, in a tone that is friendly but professional. No emoji.
- Keep it short: 3-5 sentences, suitable for WhatsApp.
- Always mention the property and the viewing date. Write the date without a year, like "18 October".
- Use the remarks/notes where relevant, but do not promise anything about any concerns the client raised (e.g. noise, condition). Either leave such concerns out, or acknowledge them neutrally without committing to a fix or outcome.
- Always end by asking the client for their preferred day and time for the next viewing.
- Use ONLY the client name, property, viewing date, and remarks given to you. Never invent facts that aren't in the details provided - no prices, no availability, no promises.
- Sign off on its own two lines: "Best regards," then the assigned agent's first name only on the line after.
- Output the message text only - no subject line, no quotation marks, no explanation.`;
// ───────────────────────────────────────────────────────────────────────

export interface FollowUpFacts {
  clientName: string;
  propertyAddress: string;
  appointmentAt: string;
  notes: string | null;
  agentName: string;
}

function buildUserPrompt(facts: FollowUpFacts): string {
  const viewingDate = new Date(facts.appointmentAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return [
    `Client name: ${facts.clientName}`,
    `Property: ${facts.propertyAddress}`,
    `Viewing date: ${viewingDate}`,
    `Remarks from the viewing: ${facts.notes?.trim() || "(none recorded)"}`,
    `Assigned agent: ${facts.agentName}`,
  ].join("\n");
}

export class FollowUpDraftError extends Error {}

export async function draftFollowUpMessage(facts: FollowUpFacts): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new FollowUpDraftError("OPENROUTER_API_KEY is not configured on the server.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: FOLLOW_UP_MODEL,
      messages: [
        { role: "system", content: FOLLOW_UP_INSTRUCTIONS },
        { role: "user", content: buildUserPrompt(facts) },
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new FollowUpDraftError(`OpenRouter request failed (${response.status}).`);
  }

  const data = await response.json();
  const draft = data?.choices?.[0]?.message?.content?.trim();
  if (!draft) {
    throw new FollowUpDraftError("OpenRouter returned an empty draft.");
  }

  return draft;
}
