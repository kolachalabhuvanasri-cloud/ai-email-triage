import type { AssignedTeam, EmailCategory, PriorityLevel } from "@/types/triage";

export const categoryOptions: Array<{ value: EmailCategory | "all"; label: string }> = [
  { value: "all", label: "All categories" },
  { value: "billing", label: "Billing" },
  { value: "bug", label: "Bug" },
  { value: "how_to", label: "How-to" },
  { value: "feature_request", label: "Feature request" },
  { value: "other", label: "Other" },
];

export const priorityOptions: Array<{ value: PriorityLevel | "all"; label: string }> = [
  { value: "all", label: "All priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const assignedTeamOptions: Array<{ value: AssignedTeam | "all"; label: string }> = [
  { value: "all", label: "All teams" },
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing" },
  { value: "engineering", label: "Engineering" },
];

export const triageTeamOptions: Array<{ value: AssignedTeam; label: string }> = [
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing" },
  { value: "engineering", label: "Engineering" },
];

export const triageCategoryOptions: Array<{ value: EmailCategory; label: string }> = categoryOptions.filter(
  (option): option is { value: EmailCategory; label: string } => option.value !== "all",
);

export const triagePriorityOptions: Array<{ value: PriorityLevel; label: string }> = priorityOptions.filter(
  (option): option is { value: PriorityLevel; label: string } => option.value !== "all",
);

export const categoryLabelMap: Record<EmailCategory, string> = {
  billing: "Billing",
  bug: "Bug",
  how_to: "How-to",
  feature_request: "Feature request",
  other: "Other",
};

export const priorityLabelMap: Record<PriorityLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const teamLabelMap: Record<AssignedTeam, string> = {
  support: "Support",
  billing: "Billing",
  engineering: "Engineering",
};

