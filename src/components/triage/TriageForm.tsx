import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import type { FeedbackMessage } from "@/types/api";
import type { TriageDraft } from "@/types/triage";
import {
  triageCategoryOptions,
  triagePriorityOptions,
  triageTeamOptions,
} from "@/utils/constants";
import { ConfidenceMeter } from "@/components/triage/ConfidenceMeter";

interface TriageFormProps {
  draft: TriageDraft | null;
  feedback: FeedbackMessage | null;
  saving: boolean;
  triaging: boolean;
  isDirty: boolean;
  onFieldChange: <K extends keyof TriageDraft>(key: K, value: TriageDraft[K]) => void;
  onSave: () => void;
  onRunTriage: () => void;
  onApprove: () => void;
  onMarkForReview: () => void;
  onReassign: () => void;
}

const feedbackToneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
} as const;

export function TriageForm({
  draft,
  feedback,
  saving,
  triaging,
  isDirty,
  onFieldChange,
  onSave,
  onRunTriage,
  onApprove,
  onMarkForReview,
  onReassign,
}: TriageFormProps) {
  if (!draft) {
    return (
      <EmptyState
        title="No AI triage yet"
        description="Run the triage workflow to classify this message, score urgency, and draft a suggested response."
        actionLabel="Run AI triage"
        onAction={onRunTriage}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ConfidenceMeter value={draft.confidence} />

      {feedback ? (
        <div
          className={`rounded-[24px] border px-4 py-3 text-sm font-medium ${
            feedbackToneClasses[feedback.tone]
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Category
          </span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            onChange={(event) => onFieldChange("category", event.target.value as TriageDraft["category"])}
            value={draft.category}
          >
            {triageCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Priority
          </span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            onChange={(event) => onFieldChange("priority", event.target.value as TriageDraft["priority"])}
            value={draft.priority}
          >
            {triagePriorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Assigned team
        </span>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          onChange={(event) => onFieldChange("assigned_team", event.target.value as TriageDraft["assigned_team"])}
          value={draft.assigned_team}
        >
          {triageTeamOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Summary
        </span>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          onChange={(event) => onFieldChange("summary", event.target.value)}
          value={draft.summary}
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Suggested reply
        </span>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          onChange={(event) => onFieldChange("suggested_reply", event.target.value)}
          value={draft.suggested_reply}
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Reviewer notes
        </span>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          onChange={(event) => onFieldChange("reviewer_notes", event.target.value)}
          placeholder="Add context for the person who will own the reply."
          value={draft.reviewer_notes}
        />
      </label>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">
        <input
          checked={draft.needs_human_review}
          className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-teal-200"
          onChange={(event) => onFieldChange("needs_human_review", event.target.checked)}
          type="checkbox"
        />
        Flag this email for human review before sending any response
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button loading={triaging} onClick={onRunTriage} variant="secondary">
          Run AI triage
        </Button>
        <Button loading={saving} onClick={onApprove}>
          Approve
        </Button>
        <Button loading={saving} onClick={onReassign} variant="ghost">
          Reassign
        </Button>
        <Button loading={saving} onClick={onMarkForReview} variant="ghost">
          Mark for review
        </Button>
      </div>

      <Button
        fullWidth
        loading={saving}
        onClick={onSave}
        variant="primary"
        disabled={!isDirty}
      >
        Save changes
      </Button>
    </div>
  );
}

