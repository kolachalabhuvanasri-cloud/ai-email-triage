import type { ReactNode } from "react";

interface DashboardLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  detail: ReactNode;
  triage: ReactNode;
}

export function DashboardLayout({
  header,
  sidebar,
  detail,
  triage,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {header}

        <div className="mt-5 grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_390px]">
          <section className="panel-surface h-fit xl:h-[calc(100vh-17rem)]">
            {sidebar}
          </section>
          <section className="panel-surface xl:h-[calc(100vh-17rem)]">
            {detail}
          </section>
          <section className="panel-surface xl:h-[calc(100vh-17rem)]">
            {triage}
          </section>
        </div>
      </div>
    </div>
  );
}

