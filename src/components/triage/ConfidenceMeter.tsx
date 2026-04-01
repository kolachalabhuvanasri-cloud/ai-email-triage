import { clampConfidence } from "@/utils/format";

interface ConfidenceMeterProps {
  value: number;
}

export function ConfidenceMeter({ value }: ConfidenceMeterProps) {
  const normalized = clampConfidence(value);
  const percentage = Math.round(normalized * 100);
  const barColor =
    percentage >= 85
      ? "bg-emerald-500"
      : percentage >= 70
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Model confidence
        </p>
        <p className="text-sm font-semibold text-slate-900">{percentage}%</p>
      </div>
      <div className="mt-3 h-3 rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

