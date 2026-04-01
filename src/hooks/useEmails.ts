import { startTransition, useDeferredValue, useEffect, useEffectEvent, useState } from "react";
import { getEmailById, listEmails } from "@/services/emailService";
import { defaultEmailFilters, type EmailFilters, type EmailRecord } from "@/types/email";

export function useEmails() {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmailFilters>(defaultEmailFilters);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const deferredSearch = useDeferredValue(filters.search);

  const loadEmails = useEffectEvent(async () => {
    setListLoading(true);
    setListError(null);

    try {
      const result = await listEmails();
      setEmails(result.data);
      setUsingMockData(result.source === "mock");

      if (!selectedEmailId && result.data.length > 0) {
        setSelectedEmailId(result.data[0].id);
      }
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Unable to load emails.");
    } finally {
      setListLoading(false);
    }
  });

  const loadEmailDetail = useEffectEvent(async (id: string) => {
    setDetailLoading(true);

    try {
      const result = await getEmailById(id);
      setSelectedEmail(result.data);
      setUsingMockData(result.source === "mock");
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Unable to load email details.");
    } finally {
      setDetailLoading(false);
    }
  });

  useEffect(() => {
    void loadEmails();
  }, [loadEmails]);

  useEffect(() => {
    if (!selectedEmailId) {
      setSelectedEmail(null);
      return;
    }

    void loadEmailDetail(selectedEmailId);
  }, [loadEmailDetail, selectedEmailId]);

  const selectEmail = (id: string) => {
    startTransition(() => {
      setSelectedEmailId(id);
    });
  };

  const setFilterValue = <K extends keyof EmailFilters>(key: K, value: EmailFilters[K]) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const replaceEmail = (updatedEmail: EmailRecord) => {
    setEmails((current) =>
      current.map((email) => (email.id === updatedEmail.id ? updatedEmail : email)),
    );
    setSelectedEmail(updatedEmail);
  };

  const filteredEmails = emails.filter((email) => {
    const searchTerm = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      searchTerm.length === 0 ||
      `${email.sender} ${email.subject} ${email.body}`.toLowerCase().includes(searchTerm);

    const matchesCategory =
      filters.category === "all" || email.triage?.category === filters.category;
    const matchesPriority =
      filters.priority === "all" || email.triage?.priority === filters.priority;
    const matchesTeam =
      filters.assignedTeam === "all" || email.triage?.assigned_team === filters.assignedTeam;
    const matchesHumanReview = !filters.humanReviewOnly || email.triage?.needs_human_review === true;

    return matchesSearch && matchesCategory && matchesPriority && matchesTeam && matchesHumanReview;
  });

  return {
    emails,
    filteredEmails,
    filters,
    setFilterValue,
    selectedEmail,
    selectedEmailId,
    selectEmail,
    replaceEmail,
    listLoading,
    detailLoading,
    listError,
    usingMockData,
    refreshEmails: loadEmails,
  };
}

