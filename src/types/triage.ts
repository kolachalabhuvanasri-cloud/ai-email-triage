export type EmailCategory =
  | "billing"
  | "bug"
  | "how_to"
  | "feature_request"
  | "other";

export type PriorityLevel = "low" | "medium" | "high" | "urgent";

export type AssignedTeam = "support" | "billing" | "engineering";

export interface TriageResult {
  category: EmailCategory;
  priority: PriorityLevel;
  assigned_team: AssignedTeam;
  summary: string;
  suggested_reply: string;
  confidence: number;
  needs_human_review: boolean;
  reviewer_notes?: string;
  approved?: boolean;
  last_updated_at?: string;
}

export interface TriageDraft {
  category: EmailCategory;
  priority: PriorityLevel;
  assigned_team: AssignedTeam;
  summary: string;
  suggested_reply: string;
  confidence: number;
  needs_human_review: boolean;
  reviewer_notes: string;
  approved: boolean;
}

