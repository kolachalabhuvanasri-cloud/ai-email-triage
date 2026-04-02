import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { HttpError } from "../utils/httpError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function signup(req, res, next) {
  const { email, password, name } = req.body;
  if (!name) {
    return next(new HttpError(400, "name is required."));
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return next(new HttpError(409, "A user already exists for this email."));
  }

  const user = await User.create({
    email,
    name,
    password_hash: hashPassword(password),
  });

  return res.status(201).json({ token: createToken(user), user });
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !verifyPassword(password, user.password_hash)) {
    return next(new HttpError(401, "Invalid email or password."));
  }

  return res.json({ token: createToken(user), user: user.toJSON() });
}

export async function me(req, res, next) {
  const user = await User.findById(req.user.sub);
  if (!user) {
    return next(new HttpError(404, "User not found."));
  }

  return res.json({ user });
}
