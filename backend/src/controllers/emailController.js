import { Email } from "../models/Email.js";
import { createTriage } from "../services/triageService.js";

function mapStatus(triage) {
  return triage?.approved ? "reviewed" : "triaged";
}

export async function listEmails(_req, res) {
  const emails = await Email.find().sort({ received_at: -1 });
  res.json(emails);
}

export async function getEmailById(req, res) {
  const email = await Email.findById(req.params.id);

  if (!email) {
    return res.status(404).json({ message: `Email ${req.params.id} not found.` });
  }

  return res.json(email);
}

export async function patchEmail(req, res) {
  const email = await Email.findById(req.params.id);

  if (!email) {
    return res.status(404).json({ message: `Email ${req.params.id} not found.` });
  }

  const existingTriage = email.triage ?? createTriage(email);
  const nextTriage = {
    ...existingTriage,
    ...req.body,
    reviewer_notes: req.body.reviewer_notes ?? existingTriage.reviewer_notes ?? "",
    approved: req.body.approved ?? existingTriage.approved ?? false,
    last_updated_at: new Date(),
  };

  email.triage = nextTriage;
  email.status = mapStatus(nextTriage);

  await email.save();

  return res.json(email);
}

export async function triageEmail(req, res) {
  const email = await Email.findById(req.body.id);

  if (!email) {
    return res.status(404).json({ message: `Email ${req.body.id} not found.` });
  }

  email.triage = createTriage(req.body);
  email.status = "triaged";
  await email.save();

  return res.json(email);
}
