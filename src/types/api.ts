import type { AssignedTeam, EmailCategory, PriorityLevel } from "@/types/triage";

export interface ServiceResult<T> {
  data: T;
  source: "api" | "mock";
}

export interface TriageEmailRequest {
  sender: string;
  subject: string;
  body: string;
}

export interface UpdateEmailRequest {
  category?: EmailCategory;
  priority?: PriorityLevel;
  assigned_team?: AssignedTeam;
  summary?: string;
  suggested_reply?: string;
  confidence?: number;
  needs_human_review?: boolean;
  reviewer_notes?: string;
  approved?: boolean;
}

export interface FeedbackMessage {
  tone: "success" | "error" | "info";
  text: string;
}

