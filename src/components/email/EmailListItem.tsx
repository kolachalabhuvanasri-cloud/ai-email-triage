import { Badge } from "@/components/common/Badge";
import type { EmailRecord } from "@/types/email";
import { formatRelativeTime, truncateText } from "@/utils/format";

interface EmailListItemProps {
  email: EmailRecord;
  selected: boolean;
  onSelect: (id: string) => void;
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

export function EmailListItem({ email, selected, onSelect }: EmailListItemProps) {
  return (
    <button
      className={`w-full rounded-[24px] border px-4 py-4 text-left transition duration-200 ${
        selected
          ? "border-slate-950 bg-slate-950 text-white shadow-[0_20px_40px_rgba(15,23,42,0.2)]"
          : "border-slate-200/80 bg-white/70 text-slate-900 hover:border-slate-300 hover:bg-white"
      }`}
      onClick={() => onSelect(email.id)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold ${selected ? "text-white" : "text-slate-900"}`}>
            {email.customer_name}
          </p>
          <p className={`text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}>
            {email.sender}
          </p>
        </div>
        <span className={`text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}>
          {formatRelativeTime(email.received_at)}
        </span>
      </div>

      <p className={`mt-4 line-clamp-2 text-sm font-semibold ${selected ? "text-white" : "text-slate-900"}`}>
        {email.subject}
      </p>
      <p className={`mt-2 text-sm leading-6 ${selected ? "text-slate-200" : "text-slate-500"}`}>
        {truncateText(email.snippet, 105)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {email.triage ? (
          <>
            <Badge tone={categoryToneMap[email.triage.category]}>{email.triage.category.replace("_", " ")}</Badge>
            <Badge tone={priorityToneMap[email.triage.priority]}>{email.triage.priority}</Badge>
          </>
        ) : (
          <Badge tone="neutral">Awaiting triage</Badge>
        )}
        {email.triage?.needs_human_review ? <Badge tone="team">Human review</Badge> : null}
      </div>
    </button>
  );
}

