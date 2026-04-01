import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { Loader } from "@/components/common/Loader";
import type { EmailRecord } from "@/types/email";
import { formatDateTime } from "@/utils/format";

interface EmailDetailProps {
  email: EmailRecord | null;
  loading: boolean;
}

const categoryToneMap = {
  billing: "billing",
  bug: "bug",
  how_to: "how_to",
  feature_request: "feature_request",
  other: "neutral",
} as const;

const priorityToneMap = {
  low: "low",
  medium: "medium",
  high: "high",
  urgent: "urgent",
} as const;

export function EmailDetail({ email, loading }: EmailDetailProps) {
  if (loading) {
    return <Loader label="Loading email details" />;
  }

  if (!email) {
    return (
      <EmptyState
        title="Select an email"
        description="Choose a message from the inbox to inspect the customer context and AI recommendations."
      />
    );
  }

  const paragraphs = email.body.split("\n\n").filter(Boolean);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-200/80 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          Customer message
        </p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              {email.subject}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              From {email.customer_name} • {email.sender}
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>{formatDateTime(email.received_at)}</p>
            <p className="mt-2 capitalize">{email.status}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {email.triage ? (
            <>
              <Badge tone={categoryToneMap[email.triage.category]}>
                {email.triage.category.replace("_", " ")}
              </Badge>
              <Badge tone={priorityToneMap[email.triage.priority]}>
                {email.triage.priority}
              </Badge>
              <Badge tone="team">{email.triage.assigned_team}</Badge>
            </>
          ) : (
            <Badge tone="neutral">No triage yet</Badge>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="rounded-[28px] border border-slate-200/80 bg-white/70 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Email body
          </p>
          <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-700">
            {paragraphs.map((paragraph, index) => (
              <p key={`${email.id}-paragraph-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-slate-200/80 bg-slate-950 p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Routing snapshot
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              {email.triage
                ? `AI recommends ${email.triage.assigned_team} because the email is classified as ${email.triage.category.replace("_", " ")}.`
                : "Run triage to generate category, urgency, and routing guidance."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Customer success cue
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Keep the first human response fast and specific. If a reply draft exists, make sure it matches the customer’s real issue before sending.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

