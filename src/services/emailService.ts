import { mockEmails } from "@/data/mockEmails";
import { ApiUnavailableError, apiRequest } from "@/services/api";
import type { ServiceResult, TriageEmailRequest, UpdateEmailRequest } from "@/types/api";
import type { EmailRecord } from "@/types/email";
import type { AssignedTeam, EmailCategory, PriorityLevel, TriageResult } from "@/types/triage";
import { clampConfidence, truncateText } from "@/utils/format";

let mockEmailStore: EmailRecord[] = structuredClone(mockEmails);

function routeTeam(category: EmailCategory): AssignedTeam {
  switch (category) {
    case "billing":
      return "billing";
    case "bug":
      return "engineering";
    case "how_to":
    case "feature_request":
    case "other":
    default:
      return "support";
  }
}

function inferCategory(content: string): EmailCategory {
  if (/(invoice|charge|charged|billing|refund|payment|subscription|renewal)/i.test(content)) {
    return "billing";
  }

  if (/(bug|error|issue|outage|500|crash|broken|fail|failed|expired|login)/i.test(content)) {
    return "bug";
  }

  if (/(how do i|how to|where can i|steps|guide|help me)/i.test(content)) {
    return "how_to";
  }

  if (/(feature|roadmap|request|would love|can you add|integration)/i.test(content)) {
    return "feature_request";
  }

  return "other";
}

function inferPriority(content: string, category: EmailCategory): PriorityLevel {
  if (/(urgent|asap|production|down|outage|blocking|cannot log in|can't log in|locked out)/i.test(content)) {
    return "urgent";
  }

  if (category === "bug" && /(multiple|slowing|across|all users|team)/i.test(content)) {
    return "high";
  }

  if (category === "billing" || category === "feature_request") {
    return "medium";
  }

  return category === "how_to" ? "low" : "medium";
}

function buildReply(category: EmailCategory, priority: PriorityLevel): string {
  if (category === "billing") {
    return "Thanks for reaching out. We are reviewing the billing details now and will confirm the next step as soon as we finish checking the account.";
  }

  if (category === "bug" && priority === "urgent") {
    return "Thanks for flagging this. We have marked the issue as urgent and routed it to engineering for immediate investigation. We will keep you updated with progress.";
  }

  if (category === "bug") {
    return "Thanks for reporting this. Engineering is reviewing the issue now, and we will follow up once we have an update or need more details.";
  }

  if (category === "how_to") {
    return "Happy to help. We are reviewing the setup steps and will send clear instructions shortly.";
  }

  if (category === "feature_request") {
    return "Thanks for the suggestion. We have logged the request with the team and will keep it in mind for future planning.";
  }

  return "Thanks for contacting us. We are reviewing your message and will follow up with the right next step shortly.";
}

function buildSummary(subject: string, body: string, category: EmailCategory, priority: PriorityLevel): string {
  const focus = truncateText(body.replace(/\s+/g, " ").trim(), 100);
  return `${subject} classified as ${category.replace("_", " ")} with ${priority} priority. ${focus}`;
}

function createMockTriage(payload: TriageEmailRequest): TriageResult {
  const content = `${payload.subject} ${payload.body}`;
  const category = inferCategory(content);
  const priority = inferPriority(content, category);
  const assignedTeam = routeTeam(category);
  const confidenceBase = priority === "urgent" ? 0.96 : category === "other" ? 0.72 : 0.87;

  return {
    category,
    priority,
    assigned_team: assignedTeam,
    summary: buildSummary(payload.subject, payload.body, category, priority),
    suggested_reply: buildReply(category, priority),
    confidence: clampConfidence(confidenceBase),
    needs_human_review: priority === "urgent" || priority === "high" || confidenceBase < 0.8,
    reviewer_notes: "",
    approved: false,
    last_updated_at: new Date().toISOString(),
  };
}

function mergeEmailUpdate(email: EmailRecord, update: UpdateEmailRequest): EmailRecord {
  const existingTriage = email.triage ?? createMockTriage(email);
  const nextTriage: TriageResult = {
    ...existingTriage,
    ...update,
    reviewer_notes: update.reviewer_notes ?? existingTriage.reviewer_notes ?? "",
    approved: update.approved ?? existingTriage.approved ?? false,
    last_updated_at: new Date().toISOString(),
  };

  return {
    ...email,
    status: nextTriage.approved ? "reviewed" : "triaged",
    triage: nextTriage,
  };
}

function findMockEmail(id: string): EmailRecord {
  const email = mockEmailStore.find((entry) => entry.id === id);

  if (!email) {
    throw new Error(`Email ${id} not found.`);
  }

  return email;
}

function createMockServiceResult<T>(data: T): ServiceResult<T> {
  return { data, source: "mock" };
}

export async function listEmails(): Promise<ServiceResult<EmailRecord[]>> {
  try {
    return await apiRequest<EmailRecord[]>("/emails");
  } catch (error) {
    if (!(error instanceof ApiUnavailableError)) {
      throw error;
    }

    return createMockServiceResult(structuredClone(mockEmailStore));
  }
}

export async function getEmailById(id: string): Promise<ServiceResult<EmailRecord>> {
  try {
    return await apiRequest<EmailRecord>(`/emails/${id}`);
  } catch (error) {
    if (!(error instanceof ApiUnavailableError)) {
      throw error;
    }

    return createMockServiceResult(structuredClone(findMockEmail(id)));
  }
}

export async function triageEmail(id: string): Promise<ServiceResult<EmailRecord>> {
  const email = findMockEmail(id);
  const payload: TriageEmailRequest = {
    sender: email.sender,
    subject: email.subject,
    body: email.body,
  };

  try {
    return await apiRequest<EmailRecord>("/triage-email", {
      method: "POST",
      body: JSON.stringify({ ...payload, id }),
    });
  } catch (error) {
    if (!(error instanceof ApiUnavailableError)) {
      throw error;
    }

    const nextEmail: EmailRecord = {
      ...email,
      status: "triaged",
      triage: createMockTriage(payload),
    };

    mockEmailStore = mockEmailStore.map((entry) => (entry.id === id ? nextEmail : entry));
    return createMockServiceResult(structuredClone(nextEmail));
  }
}

export async function updateEmail(id: string, update: UpdateEmailRequest): Promise<ServiceResult<EmailRecord>> {
  try {
    return await apiRequest<EmailRecord>(`/emails/${id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    });
  } catch (error) {
    if (!(error instanceof ApiUnavailableError)) {
      throw error;
    }

    const email = findMockEmail(id);
    const nextEmail = mergeEmailUpdate(email, update);
    mockEmailStore = mockEmailStore.map((entry) => (entry.id === id ? nextEmail : entry));
    return createMockServiceResult(structuredClone(nextEmail));
  }
}

