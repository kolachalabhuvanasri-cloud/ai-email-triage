import { Session } from "../models/session.model.js";
import { HttpError } from "../utils/httpError.js";

function parseDurationToMs(value) {
  if (typeof value === "number") {
    return value;
  }

  const match = String(value).trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    return null;
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
}


export function getSessionExpiryDate(expiresIn) {
  const durationMs = parseDurationToMs(expiresIn);
  if (!durationMs || Number.isNaN(durationMs)) {
    throw new HttpError(500, "Invalid JWT expiry configuration.");
  }

  return new Date(Date.now() + durationMs);
}

export async function createSession({ userId, expiresAt, rememberMe }) {
  return Session.create({
    user_id: userId,
    expires_at: expiresAt,
    remember_me: rememberMe,
    last_activity_at: new Date(),
  });
}
