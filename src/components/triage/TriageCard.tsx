import { EmptyState } from "@/components/common/EmptyState";
import type { FeedbackMessage } from "@/types/api";
import type { EmailRecord } from "@/types/email";
import type { TriageDraft } from "@/types/triage";
import { TriageForm } from "@/components/triage/TriageForm";

interface TriageCardProps {
  email: EmailRecord | null;
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

export function TriageCard({
  email,
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
}: TriageCardProps) {
  if (!email) {
    return (
      <EmptyState
        title="No triage context yet"
        description="Pick an email first, then review the AI classification and routing recommendation here."
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-200/80 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          AI triage
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
          Review and adjust
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Confirm the category, urgency, routing decision, and reply draft before handing it off.
        </p>
      </div>

      <div className="mt-6 overflow-y-auto pr-1">
        <TriageForm
          draft={draft}
          feedback={feedback}
          isDirty={isDirty}
          onApprove={onApprove}
          onFieldChange={onFieldChange}
          onMarkForReview={onMarkForReview}
          onReassign={onReassign}
          onRunTriage={onRunTriage}
          onSave={onSave}
          saving={saving}
          triaging={triaging}
        />
      </div>
    </div>
  );
}

