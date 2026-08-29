export type ViewingStage = "1st" | "2nd" | "3rd";
export type ViewingStatus = "scheduled" | "completed" | "missed";
export type ViewingResult =
  | "not_interested"
  | "needs_another_viewing"
  | "interested_ready_to_commit";

export const VIEWING_STAGES: ViewingStage[] = ["1st", "2nd", "3rd"];
export const VIEWING_STATUSES: ViewingStatus[] = [
  "scheduled",
  "completed",
  "missed",
];
export const VIEWING_RESULTS: ViewingResult[] = [
  "not_interested",
  "needs_another_viewing",
  "interested_ready_to_commit",
];

export interface Client {
  id: string;
  user_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export interface Agent {
  id: string;
  user_id: string | null;
  name: string;
  agent_code: string | null;
  agent_email: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  user_id: string | null;
  address: string;
  listing_ref: string | null;
  notes: string | null;
  created_at: string;
}

export interface Viewing {
  id: string;
  user_id: string | null;
  client_id: string;
  property_id: string;
  agent_id: string | null;
  appointment_at: string;
  stage: ViewingStage;
  status: ViewingStatus;
  result: ViewingResult | null;
  notes: string | null;
  result_summary: string | null;
  result_summary_source: string | null;
  result_summary_confidence: number | null;
  result_summary_review_status: string | null;
  follow_up: boolean;
  created_at: string;
}

export interface ViewingWithRelations extends Viewing {
  client: Pick<Client, "id" | "name" | "phone"> | null;
  property: Pick<Property, "id" | "address"> | null;
  agent: Pick<Agent, "id" | "name" | "agent_code" | "agent_email"> | null;
}

export interface ViewingFilters {
  agentId?: string;
  status?: ViewingStatus;
  result?: ViewingResult;
  dateFrom?: string;
  dateTo?: string;
  needsFollowUp?: boolean;
}
