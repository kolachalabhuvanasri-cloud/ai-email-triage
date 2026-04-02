import crypto from "node:crypto";
import mongoose from "mongoose";
import { seedEmails } from "../data/seedData.js";
import { Email } from "../models/email.model.js";
import { generateTriage, buildSnippet } from "../services/triage.service.js";
import { isDatabaseConnected } from "../config/db.js";

function deriveStatus(triage) {
  return triage?.approved ? "reviewed" : "triaged";
}

function clone(value) {
  return structuredClone(value);
}

const memoryEmails = seedEmails.map((email, index) => ({
  id: `seed-${index + 1}-${crypto.randomUUID().slice(0, 8)}`,
  sender: email.sender,
  customer_name: email.customer_name,
  subject: email.subject,
  body: email.body,
  snippet: buildSnippet(email.body),
  received_at: email.received_at,
  status: email.status,
  triage: email.triage
    ? {
        ...email.triage,
      }
    : undefined,
}));

function sortByReceivedAtDesc(items) {
  return items.sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime());
}

function findMemoryEmail(id) {
  return memoryEmails.find((email) => email.id === id) ?? null;
}

function mergeTriage(existingTriage, updates) {
  return {
    ...(existingTriage ?? {}),
    ...updates,
    reviewer_notes: updates.reviewer_notes ?? existingTriage?.reviewer_notes ?? "",
    approved: updates.approved ?? existingTriage?.approved ?? false,
    last_updated_at: new Date().toISOString(),
  };
}

function toApiEmail(document) {
  if (!document) {
    return null;
  }

  if (typeof document.toJSON === "function") {
    return document.toJSON();
  }

  return clone(document);
}

export async function listEmails() {
  if (isDatabaseConnected()) {
    const docs = await Email.find().sort({ received_at: -1 });
    return docs.map((doc) => toApiEmail(doc));
  }

  return sortByReceivedAtDesc(clone(memoryEmails));
}

export async function getEmailById(id) {
  if (isDatabaseConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await Email.findById(id);
    return toApiEmail(doc);
  }

  return toApiEmail(findMemoryEmail(id));
}

export async function updateEmailById(id, updates) {
  if (isDatabaseConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await Email.findById(id);
    if (!doc) {
      return null;
    }

    const existingTriage = doc.triage?.toObject?.() ?? doc.triage;
    const nextTriage = mergeTriage(existingTriage ?? generateTriage(doc), updates);

    doc.triage = nextTriage;
    doc.status = deriveStatus(nextTriage);
    await doc.save();

    return toApiEmail(doc);
  }

  const email = findMemoryEmail(id);
  if (!email) {
    return null;
  }

  const nextTriage = mergeTriage(email.triage ?? generateTriage(email), updates);
  email.triage = nextTriage;
  email.status = deriveStatus(nextTriage);

  return toApiEmail(email);
}

export async function runEmailTriage(id, payload) {
  if (isDatabaseConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await Email.findById(id);
    if (!doc) {
      return null;
    }

    doc.triage = generateTriage({
      sender: payload.sender,
      subject: payload.subject,
      body: payload.body,
    });
    doc.status = deriveStatus(doc.triage);
    await doc.save();

    return toApiEmail(doc);
  }

  const email = findMemoryEmail(id);
  if (!email) {
    return null;
  }

  email.triage = generateTriage({
    sender: payload.sender,
    subject: payload.subject,
    body: payload.body,
  });
  email.status = deriveStatus(email.triage);

  return toApiEmail(email);
}
