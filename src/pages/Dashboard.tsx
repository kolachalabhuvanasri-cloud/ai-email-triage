import { EmailDetail } from "@/components/email/EmailDetail";
import { EmailList } from "@/components/email/EmailList";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Header";
import { SidebarFilters } from "@/components/layout/SidebarFilters";
import { TriageCard } from "@/components/triage/TriageCard";
import { useEmails } from "@/hooks/useEmails";
import { useTriage } from "@/hooks/useTriage";
import { defaultEmailFilters } from "@/types/email";

export function Dashboard() {
  const {
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
    refreshEmails,
  } = useEmails();

  const {
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
  } = useTriage(selectedEmail, replaceEmail);

  const urgentEmails = emails.filter((email) => email.triage?.priority === "urgent").length;
  const reviewQueue = emails.filter((email) => email.triage?.needs_human_review).length;
  const approvedToday = emails.filter((email) => email.triage?.approved).length;

  return (
    <DashboardLayout
      detail={
        <EmailDetail
          email={selectedEmail}
          loading={detailLoading}
        />
      }
      header={
        <Header
          approvedToday={approvedToday}
          onRefresh={refreshEmails}
          reviewQueue={reviewQueue}
          totalEmails={emails.length}
          urgentEmails={urgentEmails}
          usingMockData={usingMockData}
        />
      }
      sidebar={
        <div className="flex h-full flex-col">
          <SidebarFilters
            filteredCount={filteredEmails.length}
            filters={filters}
            onClear={() => {
              setFilterValue("search", defaultEmailFilters.search);
              setFilterValue("category", defaultEmailFilters.category);
              setFilterValue("priority", defaultEmailFilters.priority);
              setFilterValue("assignedTeam", defaultEmailFilters.assignedTeam);
              setFilterValue("humanReviewOnly", defaultEmailFilters.humanReviewOnly);
            }}
            onFilterChange={setFilterValue}
            totalCount={emails.length}
            usingMockData={usingMockData}
          />

          <div className="mt-5 min-h-0 flex-1 overflow-hidden">
            <EmailList
              emails={filteredEmails}
              error={listError}
              loading={listLoading}
              onSelect={selectEmail}
              selectedEmailId={selectedEmailId}
            />
          </div>
        </div>
      }
      triage={
        <TriageCard
          draft={draft}
          email={selectedEmail}
          feedback={feedback}
          isDirty={isDirty}
          onApprove={approve}
          onFieldChange={setField}
          onMarkForReview={markForReview}
          onReassign={reassign}
          onRunTriage={runTriage}
          onSave={saveChanges}
          saving={saving}
          triaging={triaging}
        />
      }
    />
  );
}

