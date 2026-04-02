import dotenv from "dotenv";

dotenv.config();

const splitCsv = (value) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

const parseBoolean = (value, fallback = false) => {
  if (value == null) return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? `${fallback}`, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.parseInt(process.env.PORT ?? "4000", 10),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ai-email-triage",
  corsOrigins: splitCsv(process.env.CORS_ORIGIN),
  jwtSecret: process.env.JWT_SECRET ?? "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  jwtRememberExpiresIn: process.env.JWT_REMEMBER_EXPIRES_IN ?? "30d",
  sessionIdleTimeoutMinutes: parseInteger(process.env.SESSION_IDLE_TIMEOUT_MINUTES, 30),
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  adminEmails: splitCsv(process.env.ADMIN_EMAILS).map((email) => email.toLowerCase()),
  mongoRequired: parseBoolean(process.env.MONGODB_REQUIRED, false),
};
