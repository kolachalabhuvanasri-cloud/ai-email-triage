import { useEffect, useState } from "react";
import { triageEmail, updateEmail } from "@/services/emailService";
import type { FeedbackMessage } from "@/types/api";
import type { EmailRecord } from "@/types/email";
import type { TriageDraft } from "@/types/triage";

function createDraft(email: EmailRecord | null): TriageDraft | null {
  if (!email?.triage) {
    return null;
  }

  return {
    category: email.triage.category,
    priority: email.triage.priority,
    assigned_team: email.triage.assigned_team,
    summary: email.triage.summary,
    suggested_reply: email.triage.suggested_reply,
    confidence: email.triage.confidence,
    needs_human_review: email.triage.needs_human_review,
    reviewer_notes: email.triage.reviewer_notes ?? "",
    approved: email.triage.approved ?? false,
  };
}

export function useTriage(
  selectedEmail: EmailRecord | null,
  onEmailUpdated: (email: EmailRecord) => void,
) {
  const [draft, setDraft] = useState<TriageDraft | null>(createDraft(selectedEmail));
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [saving, setSaving] = useState(false);
  const [triaging, setTriaging] = useState(false);

  useEffect(() => {
    setDraft(createDraft(selectedEmail));
    setFeedback(null);
  }, [selectedEmail]);

  const setField = <K extends keyof TriageDraft>(key: K, value: TriageDraft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const saveChanges = async () => {
    if (!selectedEmail || !draft) {
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const result = await updateEmail(selectedEmail.id, draft);
      onEmailUpdated(result.data);
      setDraft(createDraft(result.data));
      setFeedback({
        tone: "success",
        text:
          result.source === "mock"
            ? "Saved locally using mock mode."
            : "Changes saved to the backend.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to save triage changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  const runTriage = async () => {
    if (!selectedEmail) {
      return;
    }

    setTriaging(true);
    setFeedback(null);

    try {
      const result = await triageEmail(selectedEmail.id);
      onEmailUpdated(result.data);
      setDraft(createDraft(result.data));
      setFeedback({
        tone: "success",
        text:
          result.source === "mock"
            ? "AI triage simulated with mock data."
            : "AI triage completed from the backend.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to run triage.",
      });
    } finally {
      setTriaging(false);
    }
  };

  const approve = async () => {
    if (!selectedEmail || !draft) {
      return;
    }

    const nextDraft = {
      ...draft,
      approved: true,
      needs_human_review: false,
    };

    setDraft(nextDraft);
    setSaving(true);
    setFeedback(null);

    try {
      const result = await updateEmail(selectedEmail.id, nextDraft);
      onEmailUpdated(result.data);
      setDraft(createDraft(result.data));
      setFeedback({
        tone: "success",
        text: "Triage approved and review flag cleared.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to approve triage.",
      });
    } finally {
      setSaving(false);
    }
  };

  const markForReview = async () => {
    if (!selectedEmail || !draft) {
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const result = await updateEmail(selectedEmail.id, {
        needs_human_review: true,
        approved: false,
        reviewer_notes: draft.reviewer_notes,
      });
      onEmailUpdated(result.data);
      setDraft(createDraft(result.data));
      setFeedback({
        tone: "info",
        text: "Email marked for human review.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to mark for review.",
      });
    } finally {
      setSaving(false);
    }
  };

  const reassign = async () => {
    if (!selectedEmail || !draft) {
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const result = await updateEmail(selectedEmail.id, {
        assigned_team: draft.assigned_team,
        reviewer_notes: draft.reviewer_notes,
      });
      onEmailUpdated(result.data);
      setDraft(createDraft(result.data));
      setFeedback({
        tone: "success",
        text: `Assigned to the ${draft.assigned_team} team.`,
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to reassign email.",
      });
    } finally {
      setSaving(false);
    }
  };

  const isDirty =
    selectedEmail?.triage && draft
      ? JSON.stringify({
          ...draft,
          reviewer_notes: draft.reviewer_notes.trim(),
        }) !==
        JSON.stringify({
          ...selectedEmail.triage,
          reviewer_notes: (selectedEmail.triage.reviewer_notes ?? "").trim(),
          approved: selectedEmail.triage.approved ?? false,
        })
      : false;

  return {
    draft,
    setField,
    feedback,
    saving,
    triaging,
    isDirty,
    saveChanges,
    runTriage,
    approve,
    markForReview,
    reassign,
  };
}

