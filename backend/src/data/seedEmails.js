import { connectToDatabase } from "../config/db.js";
import { Email } from "../models/email.model.js";
import { seedEmails } from "./seedData.js";
import { buildSnippet } from "../services/triage.service.js";

async function run() {
  await connectToDatabase();
  await Email.deleteMany({});

  const documents = seedEmails.map((email) => ({
    ...email,
    received_at: new Date(email.received_at),
    snippet: buildSnippet(email.body),
  }));

  await Email.insertMany(documents);
  console.log(`Seeded ${documents.length} emails.`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
