import dotenv from "dotenv";

dotenv.config();

function parseList(value, fallback = []) {
  if (!value) return fallback;
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ai-email-triage",
  corsOrigins: parseList(process.env.CORS_ORIGIN, ["http://localhost:5173"]),
};
