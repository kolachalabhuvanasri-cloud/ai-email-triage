import type { PropsWithChildren } from "react";

type BadgeTone =
  | "neutral"
  | "billing"
  | "bug"
  | "how_to"
  | "feature_request"
  | "low"
  | "medium"
  | "high"
  | "urgent"
  | "team";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  billing: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
  bug: "bg-rose-100 text-rose-900 ring-1 ring-rose-200",
  how_to: "bg-sky-100 text-sky-900 ring-1 ring-sky-200",
  feature_request: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200",
  low: "bg-slate-100 text-slate-800 ring-1 ring-slate-200",
  medium: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
  high: "bg-orange-100 text-orange-900 ring-1 ring-orange-200",
  urgent: "bg-rose-600 text-white ring-1 ring-rose-700",
  team: "bg-white text-slate-700 ring-1 ring-slate-200",
};

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: PropsWithChildren<BadgeProps>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

