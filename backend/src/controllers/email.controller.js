import { Email } from "../models/email.model.js";
import { generateTriage } from "../services/triage.service.js";
import { HttpError } from "../utils/httpError.js";

function deriveStatus(triage) {
  return triage?.approved ? "reviewed" : "triaged";
}

export async function listEmails(_req, res) {
  const emails = await Email.find().sort({ received_at: -1 });
  return res.json(emails);
}

export async function getEmail(req, res, next) {
  const email = await Email.findById(req.params.id);
  if (!email) {
    return next(new HttpError(404, "Email not found."));
  }

  return res.json(email);
}

export async function patchEmail(req, res, next) {
  const email = await Email.findById(req.params.id);
  if (!email) {
    return next(new HttpError(404, "Email not found."));
  }

  const existingTriage = email.triage?.toObject?.() ?? email.triage;
  const merged = {
    ...(existingTriage ?? generateTriage(email)),
    ...req.body,
    reviewer_notes: req.body.reviewer_notes ?? existingTriage?.reviewer_notes ?? "",
    approved: req.body.approved ?? existingTriage?.approved ?? false,
    last_updated_at: new Date().toISOString(),
  };

  email.triage = merged;
  email.status = deriveStatus(merged);
  await email.save();

  return res.json(email);
}

export async function runTriage(req, res, next) {
  const emailId = req.body.id;

  if (!emailId) {
    return next(new HttpError(400, "id is required to triage an existing email."));
  }

  const email = await Email.findById(emailId);
  if (!email) {
    return next(new HttpError(404, "Email not found."));
  }

  email.triage = generateTriage({
    sender: req.body.sender,
    subject: req.body.subject,
    body: req.body.body,
  });
  email.status = deriveStatus(email.triage);

  await email.save();
  return res.json(email);
}
