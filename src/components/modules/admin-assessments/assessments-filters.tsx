'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ClearFiltersButton from '@/components/shared/clear-filters-button';
import { cn } from '@/lib/utils';
import type { AdminDashboardStats } from '@/types/admin-dashboard.types';
import type { AdminAssessmentsQuery } from '@/types/admin-assessments.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

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
];

type IProps = {
  query: AdminAssessmentsQuery;
  onChange: (patch: Partial<AdminAssessmentsQuery>) => void;
  counts?: AdminDashboardStats;
};

const AssessmentsFilters = ({ query, onChange, counts }: IProps) => {
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

  const tags = query.tags?.split(',').filter(Boolean) ?? [];
  const removeTag = (tag: string) =>
    onChange({ tags: tags.filter((t) => t !== tag).join(',') || undefined });

  const hasActiveFilters = Boolean(query.status || query.search || query.tags || query.creatorId || query.sortBy || query.sortOrder);
  const clearAll = () => onChange({ status: undefined, search: undefined, tags: undefined, creatorId: undefined, sortBy: undefined, sortOrder: undefined });

  return (
    <div className='flex flex-col gap-3'>
      <div
        role='tablist'
        aria-label='Assessment status'
        className='flex gap-1 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {TABS.map((tab) => {
          const active = query.status === tab.value;
          const count =
            counts &&
            (tab.value ? (counts.assessmentsByStatus[tab.value] ?? 0) : counts.totalAssessments);
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
        <select
          aria-label='Sort assessments'
          className={SELECT_CLASS}
          value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(':');
            onChange({
              sortBy: sortBy as AdminAssessmentsQuery['sortBy'],
              sortOrder: sortOrder as AdminAssessmentsQuery['sortOrder'],
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
      {(tags.length > 0 || query.creatorId) && (
        <div className='flex flex-wrap items-center gap-2 text-xs'>
          <span className='text-muted-foreground'>Filtered by</span>
          {tags.map((tag) => (
            <FilterChip key={tag} label={`Tag: ${tag}`} onRemove={() => removeTag(tag)} />
          ))}
          {query.creatorId && (
            <FilterChip
              label='Single evaluator'
              onRemove={() => onChange({ creatorId: undefined })}
            />
          )}
        </div>
      )}
    </div>
  );
};

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <button
    type='button'
    onClick={onRemove}
    aria-label={`Remove filter ${label}`}
    className='inline-flex h-7 items-center gap-1 rounded-full border bg-background px-2.5 font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50'
  >
    {label}
    <X className='size-3 text-muted-foreground' />
  </button>
);

export default AssessmentsFilters;
