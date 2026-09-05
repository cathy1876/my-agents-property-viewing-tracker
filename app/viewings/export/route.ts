import { NextRequest, NextResponse } from "next/server";
import { getViewings } from "@/lib/data/viewings";
import type { ViewingOutcome, ViewingStatus } from "@/lib/types";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const viewings = await getViewings({
    agentId: params.get("agent") || undefined,
    status: (params.get("status") as ViewingStatus) || undefined,
    outcome: (params.get("outcome") as ViewingOutcome) || undefined,
    dateFrom: params.get("dateFrom") || undefined,
    dateTo: params.get("dateTo") || undefined,
    needsFollowUp: params.get("followup") === "1",
  });

  const headers = [
    "Scheduled Date",
    "Client",
    "Client Phone",
    "Property",
    "Agent",
    "Agent Code",
    "Agent Email",
    "Status",
    "Outcome",
    "Follow-up",
    "Notes",
  ];

  const rows = viewings.map((v) => [
    new Date(v.appointment_at).toISOString(),
    v.client?.name ?? "",
    v.client?.phone ?? "",
    v.property?.address ?? "",
    v.agent?.name ?? "",
    v.agent?.agent_code ?? "",
    v.agent?.agent_email ?? "",
    v.status,
    v.outcome ?? "",
    v.follow_up ? "Yes" : "No",
    v.notes ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="viewings-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
