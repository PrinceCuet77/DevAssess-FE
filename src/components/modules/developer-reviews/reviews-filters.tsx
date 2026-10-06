'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ClearFiltersButton from '@/components/shared/clear-filters-button';
import { Input } from '@/components/ui/input';
import type { DeveloperReviewsQuery } from '@/types/developer-assessments.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

const SORTS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'rating:desc', label: 'Highest rated' },
  { value: 'rating:asc', label: 'Lowest rated' },
];

type IProps = {
  query: DeveloperReviewsQuery;
  total?: number;
  onChange: (patch: Partial<DeveloperReviewsQuery>) => void;
};

const ReviewsFilters = ({ query, total, onChange }: IProps) => {
  const [search, setSearch] = useState(query.search ?? '');
  const [prevSearch, setPrevSearch] = useState(query.search);
  const active = Boolean(query.search || query.sortBy || query.sortOrder);

  // Keep the input in sync when the URL changes elsewhere (e.g. "Clear filters").
  if (query.search !== prevSearch) {
    setPrevSearch(query.search);
    if ((query.search ?? '') !== search.trim()) setSearch(query.search ?? '');
  }

  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === (query.search ?? '')) return;
    const timer = setTimeout(() => onChange({ search: trimmed || undefined }), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange only reads the live URL
  }, [search, query.search]);

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
      <div className='relative sm:w-80'>
        <Search className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by assessment title or description'
          aria-label='Search your reviews'
          className='pl-8'
        />
      </div>
      <select
        aria-label='Sort reviews'
        className={SELECT_CLASS}
        value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(':');
          onChange({
            sortBy: sortBy as DeveloperReviewsQuery['sortBy'],
            sortOrder: sortOrder as DeveloperReviewsQuery['sortOrder'],
          });
        }}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ClearFiltersButton
        active={active}
        onClear={() => onChange({ search: undefined, sortBy: undefined, sortOrder: undefined })}
      />
      {total !== undefined && (
        <p className='text-sm text-muted-foreground sm:ml-auto' aria-live='polite'>
          {total} {total === 1 ? 'review' : 'reviews'}
        </p>
      )}
    </div>
  );
};

export default ReviewsFilters;
