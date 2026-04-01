import { EmptyState } from "@/components/common/EmptyState";
import { Loader } from "@/components/common/Loader";
import { EmailListItem } from "@/components/email/EmailListItem";
import type { EmailRecord } from "@/types/email";

interface EmailListProps {
  emails: EmailRecord[];
  selectedEmailId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
  error: string | null;
}

export function EmailList({
  emails,
  selectedEmailId,
  onSelect,
  loading,
  error,
}: EmailListProps) {
  if (loading) {
    return <Loader label="Loading inbox" />;
  }

  if (error && emails.length === 0) {
    return (
      <EmptyState
        title="Inbox unavailable"
        description={error}
      />
    );
  }

  if (emails.length === 0) {
    return (
      <EmptyState
        title="No emails match the current filters"
        description="Try broadening the filters or clearing the search query to see more messages."
      />
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto pr-1">
      {emails.map((email) => (
        <EmailListItem
          email={email}
          key={email.id}
          onSelect={onSelect}
          selected={selectedEmailId === email.id}
        />
      ))}
    </div>
  );
}

