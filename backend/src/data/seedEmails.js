export const seedEmails = [
  {
    sender: "maria@northstarhq.com",
    customer_name: "Maria Gomez",
    subject: "Invoice shows duplicate charge for March",
    body: "Hi team, Our March invoice looks like it charged us twice for the Pro plan. Can you confirm whether the second line item is expected and help us reverse it if needed?",
    received_at: "2026-04-01T08:10:00.000Z",
    status: "triaged",
    triage: {
      category: "billing",
      priority: "medium",
      assigned_team: "billing",
      summary: "Customer reports a duplicate charge on the March Pro plan invoice.",
      suggested_reply: "Thanks for flagging this. We are reviewing the March invoice now and will confirm whether the duplicate charge needs a refund or correction shortly.",
      confidence: 0.94,
      needs_human_review: false,
      reviewer_notes: "",
      approved: true,
      last_updated_at: "2026-04-01T08:20:00.000Z"
    }
  },
  {
    sender: "ops@riverandpine.io",
    customer_name: "Noah Patel",
    subject: "Production outage after latest deployment",
    body: "Hello, Right after your 7:30 AM deployment our users started seeing a 500 error on the dashboard. This is blocking our support team and we need an urgent update.",
    received_at: "2026-04-01T08:42:00.000Z",
    status: "triaged",
    triage: {
      category: "bug",
      priority: "urgent",
      assigned_team: "engineering",
      summary: "Customer reports a production-blocking 500 error after a recent deployment.",
      suggested_reply: "Thanks for reporting this. We have flagged it as urgent and routed it to engineering for immediate investigation. We will share an update as soon as we confirm impact and next steps.",
      confidence: 0.98,
      needs_human_review: true,
      reviewer_notes: "Escalate to incident channel and include deployment reference.",
      approved: false,
      last_updated_at: "2026-04-01T08:44:00.000Z"
    }
  },
  {
    sender: "finance@oakandember.com",
    customer_name: "Sofia Khan",
    subject: "Refund requested after cancellation",
    body: "Hi team, We canceled our subscription yesterday but still see a pending renewal on our card. Please confirm whether the cancellation went through and issue a refund if it processed.",
    received_at: "2026-04-01T10:05:00.000Z",
    status: "new"
  }
];
