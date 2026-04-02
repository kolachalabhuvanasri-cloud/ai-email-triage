export const seedEmails = [
  {
    sender: "maria@northstarhq.com",
    customer_name: "Maria Gomez",
    subject: "Invoice shows duplicate charge for March",
    body: "Hi team,\n\nOur March invoice looks like it charged us twice for the Pro plan. Can you confirm whether the second line item is expected and help us reverse it if needed?\n\nThanks,\nMaria",
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
    body: "Hello,\n\nRight after your 7:30 AM deployment our users started seeing a 500 error on the dashboard. This is blocking our support team and we need an urgent update.\n\nNoah",
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
    sender: "jordan@littleatlas.app",
    customer_name: "Jordan Lee",
    subject: "How do I add a second workspace admin?",
    body: "Hi,\n\nCan someone point me to the steps for adding another admin to our workspace? I found the member settings page but do not see the option.\n\nBest,\nJordan",
    received_at: "2026-04-01T09:12:00.000Z",
    status: "triaged",
    triage: {
      category: "how_to",
      priority: "low",
      assigned_team: "support",
      summary: "Customer needs guidance on granting a second workspace admin role.",
      suggested_reply: "Happy to help. You can add a second admin from Workspace Settings > Members by opening the member row and updating the role to Admin. If the option is missing, we can also verify your current permissions.",
      confidence: 0.91,
      needs_human_review: false,
      reviewer_notes: "",
      approved: true,
      last_updated_at: "2026-04-01T09:14:00.000Z"
    }
  },
  {
    sender: "maya@soloventures.co",
    customer_name: "Maya Raman",
    subject: "Would love an export to Notion",
    body: "Hey there,\n\nWe use your product heavily for ticket summaries. A direct export to Notion would save our team a lot of copy and paste work. Is that on the roadmap?\n\nMaya",
    received_at: "2026-04-01T09:28:00.000Z",
    status: "triaged",
    triage: {
      category: "feature_request",
      priority: "medium",
      assigned_team: "support",
      summary: "Customer requests a direct Notion export for ticket summaries.",
      suggested_reply: "Thanks for the suggestion. We have shared the Notion export request with the product team and can keep you posted if it moves onto the roadmap.",
      confidence: 0.88,
      needs_human_review: true,
      reviewer_notes: "Tag product feedback board.",
      approved: false,
      last_updated_at: "2026-04-01T09:32:00.000Z"
    }
  },
  {
    sender: "finance@oakandember.com",
    customer_name: "Sofia Khan",
    subject: "Refund requested after cancellation",
    body: "Hi team,\n\nWe canceled our subscription yesterday but still see a pending renewal on our card. Please confirm whether the cancellation went through and issue a refund if it processed.\n\nThank you,\nSofia",
    received_at: "2026-04-01T10:05:00.000Z",
    status: "new"
  },
  {
    sender: "support@brightsidecare.org",
    customer_name: "Amar Singh",
    subject: "Login link expires before our team can use it",
    body: "Hello,\n\nSeveral of our agents receive the magic login link, but it says expired after a couple of minutes. This is happening across different browsers and is slowing down onboarding.\n\nAmar",
    received_at: "2026-04-01T10:24:00.000Z",
    status: "triaged",
    triage: {
      category: "bug",
      priority: "high",
      assigned_team: "engineering",
      summary: "Customer reports magic login links expiring too quickly across browsers.",
      suggested_reply: "Thanks for the details. We have shared the login-link issue with engineering and are checking whether expiration settings or a recent change caused the problem.",
      confidence: 0.89,
      needs_human_review: true,
      reviewer_notes: "",
      approved: false,
      last_updated_at: "2026-04-01T10:30:00.000Z"
    }
  }
];
