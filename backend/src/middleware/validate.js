import { HttpError } from "../utils/httpError.js";

const CATEGORY_VALUES = new Set(["billing", "bug", "how_to", "feature_request", "other"]);
const PRIORITY_VALUES = new Set(["low", "medium", "high", "urgent"]);
const TEAM_VALUES = new Set(["support", "billing", "engineering"]);
const ROLE_VALUES = new Set(["admin", "support_agent"]);

export function validateTriageRequest(req, _res, next) {
  const { sender, subject, body } = req.body;
  if (!sender || !subject || !body) {
    return next(new HttpError(400, "sender, subject, and body are required."));
  }

  return next();
}

export function validateUpdateEmail(req, _res, next) {
  const payload = req.body ?? {};

  if (payload.category && !CATEGORY_VALUES.has(payload.category)) {
    return next(new HttpError(400, "Invalid category value."));
  }

  if (payload.priority && !PRIORITY_VALUES.has(payload.priority)) {
    return next(new HttpError(400, "Invalid priority value."));
  }

  if (payload.assigned_team && !TEAM_VALUES.has(payload.assigned_team)) {
    return next(new HttpError(400, "Invalid assigned_team value."));
  }

  if (payload.confidence !== undefined && (payload.confidence < 0 || payload.confidence > 1)) {
    return next(new HttpError(400, "confidence must be between 0 and 1."));
  }

  return next();
}

export function validateAuth(req, _res, next) {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return next(new HttpError(400, "email and password are required."));
  }

  if (role && !ROLE_VALUES.has(role)) {
    return next(new HttpError(400, "role must be one of: admin, support_agent."));
  }

  return next();
}

export function validateGoogleAuth(req, _res, next) {
  if (!req.body?.id_token) {
    return next(new HttpError(400, "id_token is required."));
  }

  return next();
}
