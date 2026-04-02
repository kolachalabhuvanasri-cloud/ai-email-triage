import { connectDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { Email } from "../models/Email.js";
import { seedEmails } from "./seedEmails.js";
import { normalizeEmailForInsert } from "../services/triageService.js";

async function seed() {
  await connectDatabase(env.mongoUri);

  await Email.deleteMany({});
  await Email.insertMany(seedEmails.map(normalizeEmailForInsert));

  // eslint-disable-next-line no-console
  console.log(`Seeded ${seedEmails.length} emails.`);
  process.exit(0);
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to seed data", error);
  process.exit(1);
});
