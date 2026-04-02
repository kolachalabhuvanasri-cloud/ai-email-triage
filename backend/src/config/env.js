import dotenv from "dotenv";

dotenv.config();

const splitCsv = (value) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.parseInt(process.env.PORT ?? "4000", 10),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ai-email-triage",
  corsOrigins: splitCsv(process.env.CORS_ORIGIN),
  jwtSecret: process.env.JWT_SECRET ?? "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
};
