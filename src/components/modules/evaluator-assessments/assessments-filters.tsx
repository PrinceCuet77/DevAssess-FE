'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ClearFiltersButton from '@/components/shared/clear-filters-button';
import { cn } from '@/lib/utils';
import type { EvaluatorDashboardStats } from '@/types/evaluator-dashboard.types';
import type { EvaluatorAssessmentsQuery } from '@/types/evaluator-assessments.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

// The API has no default status filter and returns DELETED rows, so "All" is pinned to the
// non-deleted tabs client-side in the view; DELETED is its own tab.
const TABS = [
  { value: undefined, label: 'All' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: 'DELETED', label: 'Deleted' },
] as const;
const SORTS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'title:asc', label: 'Title A–Z' },
  { value: 'title:desc', label: 'Title Z–A' },
  { value: 'price:asc', label: 'Price: low to high' },
  { value: 'price:desc', label: 'Price: high to low' },
  { value: 'duration:asc', label: 'Duration: short to long' },
  { value: 'duration:desc', label: 'Duration: long to short' },
];

type IProps = {
  query: EvaluatorAssessmentsQuery;
  onChange: (patch: Partial<EvaluatorAssessmentsQuery>) => void;
  stats?: EvaluatorDashboardStats;
};

const AssessmentsFilters = ({ query, onChange, stats }: IProps) => {
  const [search, setSearch] = useState(query.search ?? '');
  const [prevSearch, setPrevSearch] = useState(query.search);

  // Keep the input in sync when the URL changes elsewhere (e.g. "Clear filters").
  if (query.search !== prevSearch) {
    setPrevSearch(query.search);
    if ((query.search ?? '') !== search.trim()) setSearch(query.search ?? '');
  }

  // Debounce typing so we don't hit the rate-limited API on every keystroke.
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === (query.search ?? '')) return;
    const timer = setTimeout(() => onChange({ search: trimmed || undefined }), 400);
    return () => clearTimeout(timer);
  }, [search, query.search, onChange]);

  const countFor = (status: (typeof TABS)[number]['value']) => {
    if (!stats) return undefined;
    const by = stats.assessmentsByStatus;
    if (status) return by[status] ?? 0;
    // `totalAssessments` includes deleted ones, which "All" hides.
    return stats.totalAssessments - (by.DELETED ?? 0);
  };

  const hasActiveFilters = Boolean(
    query.status ||
      query.search ||
      query.minPrice !== undefined ||
      query.maxPrice !== undefined ||
      query.sortBy ||
      query.sortOrder,
  );
  const clearAll = () => onChange({ status: undefined, search: undefined, minPrice: undefined, maxPrice: undefined, sortBy: undefined, sortOrder: undefined });

  return (
    <div className='flex flex-col gap-3'>
      <div
        role='tablist'
        aria-label='Assessment status'
        className='flex gap-1 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {TABS.map((tab) => {
          const active = query.status === tab.value;
          const count = countFor(tab.value);
          return (
            <button
              key={tab.label}
              type='button'
              role='tab'
              aria-selected={active}
              onClick={() => onChange({ status: tab.value })}
              className={cn(
                'inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                active
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              {count !== undefined && (
                <span className='rounded-full bg-muted px-1.5 text-xs tabular-nums'>{count}</span>
              )}
            </button>
          );
        })}
      </div>
      <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
        <div className='relative sm:w-72'>
          <Search className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search title, description or tag'
            aria-label='Search assessments'
            className='pl-8'
          />
        </div>
        <div className='flex items-center gap-2'>
          <PriceInput
            label='Min price'
            value={query.minPrice}
            onCommit={(minPrice) => onChange({ minPrice })}
          />
          <span className='text-muted-foreground'>–</span>
          <PriceInput
            label='Max price'
            value={query.maxPrice}
            onCommit={(maxPrice) => onChange({ maxPrice })}
          />
        </div>
        <select
          aria-label='Sort assessments'
          className={SELECT_CLASS}
          value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(':');
            onChange({
              sortBy: sortBy as EvaluatorAssessmentsQuery['sortBy'],
              sortOrder: sortOrder as EvaluatorAssessmentsQuery['sortOrder'],
            });
          }}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ClearFiltersButton active={hasActiveFilters} onClear={clearAll} />
      </div>
    </div>
  );
};

// Commits on blur / Enter so a half-typed number doesn't trigger a request per keystroke.
const PriceInput = ({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: number | undefined;
  onCommit: (value: number | undefined) => void;
}) => {
  const [draft, setDraft] = useState(value?.toString() ?? '');
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setDraft(value?.toString() ?? '');
  }

  const commit = () => {
    const n = draft.trim() === '' ? undefined : Number(draft);
    const next = n !== undefined && Number.isFinite(n) && n >= 0 ? n : undefined;
    if (next !== value) onCommit(next);
    else setDraft(value?.toString() ?? '');
  };

  return (
    <Input
      type='number'
      inputMode='decimal'
      min={0}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && commit()}
      placeholder={label}
      aria-label={label}
      className='w-24'
    />
  );
};

export default AssessmentsFilters;
