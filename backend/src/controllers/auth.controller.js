import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { HttpError } from "../utils/httpError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { createSession, getSessionExpiryDate } from "../services/session.service.js";


function createToken(user, sessionId, expiresIn) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      sid: sessionId,
    },
    env.jwtSecret,
    { expiresIn }
  );
}

function getExpiresIn(rememberMe) {
  return rememberMe ? env.jwtRememberExpiresIn : env.jwtExpiresIn;
}

async function buildAuthResponse(user, rememberMe) {
  const expiresIn = getExpiresIn(rememberMe);
  const expiresAt = getSessionExpiryDate(expiresIn);
  const session = await createSession({ userId: user.id, expiresAt, rememberMe });

  return {
    token: createToken(user, session.id, expiresIn),
    user: user.toJSON(),
    session: {
      id: session.id,
      remember_me: rememberMe,
      expires_at: expiresAt.toISOString(),
    },
  };
}

export async function signup(req, res, next) {
  const { email, password, name, role, remember_me: rememberMe = false } = req.body;
  if (!name) {
    return next(new HttpError(400, "name is required."));
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return next(new HttpError(409, "A user already exists for this email."));
  }

  const normalizedRole = role ?? "support_agent";
  if (normalizedRole === "admin" && !env.adminEmails.includes(normalizedEmail)) {
    return next(new HttpError(403, "This email is not allowed to self-register as admin."));
  }

  const user = await User.create({
    email: normalizedEmail,
    name,
    role: normalizedRole,
    password_hash: hashPassword(password),
  });

  return res.status(201).json(await buildAuthResponse(user, rememberMe));
}

export async function login(req, res, next) {
  const { email, password, remember_me: rememberMe = false } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
    return next(new HttpError(401, "Invalid email or password."));
  }

  return res.json(await buildAuthResponse(user, rememberMe));
}

export async function loginWithGoogle(req, res, next) {
  const { id_token: idToken, remember_me: rememberMe = false } = req.body;
  if (!env.googleClientId) {
    return next(new HttpError(503, "Google login is not configured."));
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!response.ok) {
    return next(new HttpError(401, "Invalid Google id_token."));
  }

  const payload = await response.json();
  if (payload.aud !== env.googleClientId) {
    return next(new HttpError(401, "Google token audience does not match configured client ID."));
  }

  if (!payload?.email || !payload?.name || !payload?.sub) {
    return next(new HttpError(400, "Google token payload is missing required profile fields."));
  }

  const normalizedEmail = payload.email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = await User.create({
      email: normalizedEmail,
      name: payload.name,
      role: env.adminEmails.includes(normalizedEmail) ? "admin" : "support_agent",
      google_id: payload.sub,
    });
  } else if (!user.google_id) {
    user.google_id = payload.sub;
    await user.save();
  }

  return res.json(await buildAuthResponse(user, rememberMe));
}

export async function me(req, res, next) {
  const user = await User.findById(req.user.sub);
  if (!user) {
    return next(new HttpError(404, "User not found."));
  }

  return res.json({ user });
}
