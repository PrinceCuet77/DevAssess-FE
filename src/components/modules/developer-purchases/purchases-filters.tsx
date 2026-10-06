'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ClearFiltersButton from '@/components/shared/clear-filters-button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { DeveloperPurchasesQuery } from '@/types/developer-assessments.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

// The API filters on "has any payment with this status", so unpaid (never attempted) orders only show under All.
const TABS = [
  { value: undefined, label: 'All' },
  { value: 'SUCCESS', label: 'Paid' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

const SORTS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'price:desc', label: 'Total: high to low' },
  { value: 'price:asc', label: 'Total: low to high' },
];

type IProps = {
  query: DeveloperPurchasesQuery;
  onChange: (patch: Partial<DeveloperPurchasesQuery>) => void;
};

const PurchasesFilters = ({ query, onChange }: IProps) => {
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

  const active = Boolean(query.paymentStatus || query.search || query.sortBy || query.sortOrder);
  const clearAll = () =>
    onChange({ paymentStatus: undefined, search: undefined, sortBy: undefined, sortOrder: undefined });

  return (
    <div className='flex flex-col gap-3'>
      <div
        role='tablist'
        aria-label='Payment status'
        className='flex gap-1 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {TABS.map((tab) => {
          const selected = query.paymentStatus === tab.value;
          return (
            <button
              key={tab.label}
              type='button'
              role='tab'
              aria-selected={selected}
              onClick={() => onChange({ paymentStatus: tab.value })}
              className={cn(
                'inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                selected
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
        <div className='relative sm:w-80'>
          <Search className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by assessment title'
            aria-label='Search purchases by assessment title'
            className='pl-8'
          />
        </div>
        <select
          aria-label='Sort purchases'
          className={SELECT_CLASS}
          value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(':');
            onChange({
              sortBy: sortBy as DeveloperPurchasesQuery['sortBy'],
              sortOrder: sortOrder as DeveloperPurchasesQuery['sortOrder'],
            });
          }}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ClearFiltersButton active={active} onClear={clearAll} />
      </div>
    </div>
  );
};

export default PurchasesFilters;
