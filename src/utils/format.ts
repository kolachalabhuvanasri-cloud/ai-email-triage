import type { EmailCategory, PriorityLevel } from "@/types/triage";
import { categoryLabelMap, priorityLabelMap } from "@/utils/constants";

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string): string {
  const deltaSeconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  for (const [unit, seconds] of intervals) {
    if (Math.abs(deltaSeconds) >= seconds || unit === "minute") {
      return formatter.format(Math.round(deltaSeconds / seconds), unit);
    }
  }

  return formatter.format(deltaSeconds, "second");
}

export function formatCategoryLabel(category: EmailCategory): string {
  return categoryLabelMap[category];
}

export function formatPriorityLabel(priority: PriorityLevel): string {
  return priorityLabelMap[priority];
}

export function truncateText(value: string, limit = 120): string {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit).trimEnd()}...`;
}

export function clampConfidence(value: number): number {
  return Math.min(1, Math.max(0, value));
}

