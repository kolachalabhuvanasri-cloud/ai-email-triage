import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Session } from "../models/session.model.js";

function extractBearerToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length);
}

function isIdleExpired(lastActivityAt) {
  const idleLimitMs = env.sessionIdleTimeoutMinutes * 60 * 1000;
  return Date.now() - new Date(lastActivityAt).getTime() > idleLimitMs;
}

export async function requireAuth(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "Missing bearer token." });
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  if (!payload.sid) {
    return res.status(401).json({ message: "Missing session identifier in token." });
  }

  const session = await Session.findById(payload.sid);
  if (!session || session.revoked_at) {
    return res.status(401).json({ message: "Session is not active." });
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    return res.status(401).json({ message: "Session expired." });
  }

  if (isIdleExpired(session.last_activity_at)) {
    return res.status(401).json({ message: "Session timed out due to inactivity." });
  }

  session.last_activity_at = new Date();
  await session.save();

  req.user = payload;
  req.session = session;
  return next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: "Role is required to access this endpoint." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to access this endpoint." });
    }

    return next();
  };
}
