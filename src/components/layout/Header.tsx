import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";

interface HeaderProps {
  totalEmails: number;
  urgentEmails: number;
  reviewQueue: number;
  approvedToday: number;
  usingMockData: boolean;
  onRefresh: () => void | Promise<void>;
}

export function Header({
  totalEmails,
  urgentEmails,
  reviewQueue,
  approvedToday,
  usingMockData,
  onRefresh,
}: HeaderProps) {
  const statCards = [
    { label: "Inbox volume", value: totalEmails, accent: "text-slate-950" },
    { label: "Urgent issues", value: urgentEmails, accent: "text-rose-600" },
    { label: "Needs review", value: reviewQueue, accent: "text-amber-600" },
    { label: "Approved", value: approvedToday, accent: "text-emerald-600" },
  ];

  return (
    <section className="overflow-hidden rounded-[34px] border border-white/60 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,118,110,0.92))] p-6 text-white shadow-[0_30px_70px_rgba(15,23,42,0.18)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">
            AI Email Triage
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Route the right email to the right team, faster.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
            Review customer messages, inspect AI recommendations, and keep urgent issues from sitting in the shared inbox.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-white/10 text-white ring-white/20" tone="team">
            {usingMockData ? "Mock mode" : "Live API"}
          </Badge>
          <Button
            className="bg-white text-slate-950 hover:bg-slate-100"
            onClick={() => {
              void onRefresh();
            }}
            variant="secondary"
          >
            Refresh inbox
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            className="rounded-[26px] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-sm"
            key={card.label}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              {card.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${card.accent} text-white`}>{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

