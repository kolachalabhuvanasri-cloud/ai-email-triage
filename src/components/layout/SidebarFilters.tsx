import { Button } from "@/components/common/Button";
import { SearchBar } from "@/components/common/SearchBar";
import type { EmailFilters } from "@/types/email";
import { assignedTeamOptions, categoryOptions, priorityOptions } from "@/utils/constants";

interface SidebarFiltersProps {
  filters: EmailFilters;
  totalCount: number;
  filteredCount: number;
  usingMockData: boolean;
  onFilterChange: <K extends keyof EmailFilters>(key: K, value: EmailFilters[K]) => void;
  onClear: () => void;
}

export function SidebarFilters({
  filters,
  totalCount,
  filteredCount,
  usingMockData,
  onFilterChange,
  onClear,
}: SidebarFiltersProps) {
  return (
    <div className="space-y-4 border-b border-slate-200/80 pb-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
            Inbox filters
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Showing {filteredCount} of {totalCount} emails
          </p>
        </div>
        <Button onClick={onClear} variant="ghost">
          Clear
        </Button>
      </div>

      <SearchBar
        onChange={(value) => onFilterChange("search", value)}
        value={filters.search}
      />

      <div className="grid gap-3">
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          onChange={(event) => onFilterChange("category", event.target.value as EmailFilters["category"])}
          value={filters.category}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          onChange={(event) => onFilterChange("priority", event.target.value as EmailFilters["priority"])}
          value={filters.priority}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          onChange={(event) =>
            onFilterChange("assignedTeam", event.target.value as EmailFilters["assignedTeam"])
          }
          value={filters.assignedTeam}
        >
          {assignedTeamOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">
        <input
          checked={filters.humanReviewOnly}
          className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-teal-200"
          onChange={(event) => onFilterChange("humanReviewOnly", event.target.checked)}
          type="checkbox"
        />
        Show only emails needing human review
      </label>

      <p className="text-xs leading-5 text-slate-500">
        {usingMockData
          ? "Mock data is active because the backend is unavailable or not configured yet."
          : "Connected to your backend API."}
      </p>
    </div>
  );
}

