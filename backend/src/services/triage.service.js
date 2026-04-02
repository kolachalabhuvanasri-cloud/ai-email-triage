const clampConfidence = (value) => Math.min(1, Math.max(0, value));

const snippetFrom = (body) => body.replace(/\s+/g, " ").trim().slice(0, 120);

export function buildSnippet(body) {
  return snippetFrom(body);
}

function routeTeam(category) {
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

function inferCategory(content) {
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

function inferPriority(content, category) {
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

function buildReply(category, priority) {
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

function buildSummary(subject, body, category, priority) {
  const focus = body.replace(/\s+/g, " ").trim().slice(0, 100);
  return `${subject} classified as ${category.replace("_", " ")} with ${priority} priority. ${focus}`;
}

export function generateTriage(payload) {
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
