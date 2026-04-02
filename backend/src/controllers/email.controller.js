import { runEmailTriage, getEmailById, listEmails, updateEmailById } from "../repositories/email.repository.js";
import { HttpError } from "../utils/httpError.js";

export async function listEmailsController(_req, res) {
  const emails = await listEmails();
  return res.json(emails);
}

export async function getEmail(req, res, next) {
  const email = await getEmailById(req.params.id);
  if (!email) {
    return next(new HttpError(404, "Email not found."));
  }

  return res.json(email);
}

export async function patchEmail(req, res, next) {
  const email = await updateEmailById(req.params.id, req.body);
  if (!email) {
    return next(new HttpError(404, "Email not found."));
  }

  return res.json(email);
}

export async function runTriage(req, res, next) {
  const emailId = req.body.id;

  if (!emailId) {
    return next(new HttpError(400, "id is required to triage an existing email."));
  }

  const email = await runEmailTriage(emailId, {
    sender: req.body.sender,
    subject: req.body.subject,
    body: req.body.body,
  });

  if (!email) {
    return next(new HttpError(404, "Email not found."));
  }

  return res.json(email);
}
