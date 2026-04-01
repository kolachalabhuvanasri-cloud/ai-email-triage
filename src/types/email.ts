import type { AssignedTeam, EmailCategory, PriorityLevel, TriageResult } from "@/types/triage";

export interface EmailRecord {
  id: string;
  sender: string;
  customer_name: string;
  subject: string;
  body: string;
  snippet: string;
  received_at: string;
  status: "new" | "triaged" | "reviewed";
  triage?: TriageResult;
}

export interface EmailFilters {
  search: string;
  category: EmailCategory | "all";
  priority: PriorityLevel | "all";
  assignedTeam: AssignedTeam | "all";
  humanReviewOnly: boolean;
}

export const defaultEmailFilters: EmailFilters = {
  search: "",
  category: "all",
  priority: "all",
  assignedTeam: "all",
  humanReviewOnly: false,
};

