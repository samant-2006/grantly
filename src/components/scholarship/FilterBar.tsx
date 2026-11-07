import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EducationLevel, FieldOfStudy, ScholarshipCategory } from '@/types';

// ─── Option lists ────────────────────────────────────────────────
const EDUCATION_LEVELS: EducationLevel[] = ['Undergraduate', 'Postgraduate', 'Doctoral', 'Diploma'];

const FIELDS_OF_STUDY: FieldOfStudy[] = [
  'Engineering',
  'Medicine',
  'Business',
  'Arts & Humanities',
  'Science',
  'Law',
  'Education',
  'Social Sciences',
  'Computer Science',
  'Other',
];

const CATEGORIES: ScholarshipCategory[] = [
  'Merit-Based',
  'Need-Based',
  'Research',
  'STEM',
  'Arts & Culture',
  'Community Service',
  'Women in Tech',
  'International',
  'Government',
  'Institutional',
];

const FUNDING_RANGES = ['All', 'Under $10,000', '$10,000-$20,000', 'Over $20,000'] as const;
const DEADLINE_RANGES = ['All', 'Within 30 days', 'Within 90 days', 'Within 6 months'] as const;

export type FundingRange = (typeof FUNDING_RANGES)[number];
export type DeadlineRange = (typeof DEADLINE_RANGES)[number];

export type SortOption = 'relevance' | 'deadline' | 'funding';

// ─── Props ───────────────────────────────────────────────────────
export interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  educationLevel: string;
  onEducationLevelChange: (v: string) => void;
  fieldOfStudy: string;
  onFieldOfStudyChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  fundingRange: FundingRange;
  onFundingRangeChange: (v: FundingRange) => void;
  deadlineRange: DeadlineRange;
  onDeadlineRangeChange: (v: DeadlineRange) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  onClear: () => void;
  activeFilterCount: number;
}

// ─── Reusable select ─────────────────────────────────────────────
function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  allLabel = 'All',
  id,
}: {
  label: string;
  value: string;
  onChange: (v: T) => void;
  options: readonly T[];
  allLabel?: string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-[#687386]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          'h-9 rounded-lg border border-[#E5E9E5] bg-white px-3 text-sm text-[#172033]',
          'focus:border-[#D7F8A7] focus:outline-none focus:ring-2 focus:ring-[#D7F8A7]/40',
          'transition-colors'
        )}
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── FilterBar Component ─────────────────────────────────────────
export default function FilterBar({
  search,
  onSearchChange,
  educationLevel,
  onEducationLevelChange,
  fieldOfStudy,
  onFieldOfStudyChange,
  category,
  onCategoryChange,
  fundingRange,
  onFundingRangeChange,
  deadlineRange,
  onDeadlineRangeChange,
  sort,
  onSortChange,
  onClear,
  activeFilterCount,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#687386]"
          aria-hidden
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, provider, or description…"
          aria-label="Search scholarships"
          className={cn(
            'h-11 w-full rounded-xl border border-[#E5E9E5] bg-white pl-10 pr-10 text-sm text-[#172033] placeholder:text-[#687386]/60',
            'focus:border-[#D7F8A7] focus:outline-none focus:ring-2 focus:ring-[#D7F8A7]/40',
            'transition-colors'
          )}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#687386] hover:bg-gray-100 hover:text-[#172033] transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect<EducationLevel>
          id="filter-education"
          label="Education Level"
          value={educationLevel}
          onChange={(v) => onEducationLevelChange(v)}
          options={EDUCATION_LEVELS}
        />

        <FilterSelect<FieldOfStudy>
          id="filter-field"
          label="Field of Study"
          value={fieldOfStudy}
          onChange={(v) => onFieldOfStudyChange(v)}
          options={FIELDS_OF_STUDY}
        />

        <FilterSelect<ScholarshipCategory>
          id="filter-category"
          label="Category"
          value={category}
          onChange={(v) => onCategoryChange(v)}
          options={CATEGORIES}
        />

        <FilterSelect<FundingRange>
          id="filter-funding"
          label="Funding Range"
          value={fundingRange}
          onChange={(v) => onFundingRangeChange(v)}
          options={FUNDING_RANGES}
          allLabel="All"
        />

        <FilterSelect<DeadlineRange>
          id="filter-deadline"
          label="Deadline"
          value={deadlineRange}
          onChange={(v) => onDeadlineRangeChange(v)}
          options={DEADLINE_RANGES}
          allLabel="All"
        />

        {/* Sort */}
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-sort" className="text-xs font-medium text-[#687386]">
            Sort by
          </label>
          <select
            id="filter-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={cn(
              'h-9 rounded-lg border border-[#E5E9E5] bg-white px-3 text-sm text-[#172033]',
              'focus:border-[#D7F8A7] focus:outline-none focus:ring-2 focus:ring-[#D7F8A7]/40',
              'transition-colors'
            )}
          >
            <option value="relevance">Relevance</option>
            <option value="deadline">Deadline (soonest)</option>
            <option value="funding">Funding (highest)</option>
          </select>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E9E5] bg-white px-3 text-sm font-medium text-[#687386]',
              'hover:border-red-200 hover:bg-red-50 hover:text-red-600',
              'focus:outline-none focus:ring-2 focus:ring-[#D7F8A7]/40',
              'transition-colors'
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Clear Filters
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#687386]/10 text-xs font-semibold text-[#687386]">
              {activeFilterCount}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
