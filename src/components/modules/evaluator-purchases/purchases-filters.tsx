'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useGetEvaluatorAssessments } from '@/hooks';
import { cn } from '@/lib/utils';
import type { EvaluatorPurchasesQuery } from '@/types/evaluator-purchases.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

const TABS = [
  { value: undefined, label: 'All' },
  { value: 'SUCCESS', label: 'Paid' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
] as const;

const SORTS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'price:desc', label: 'Order total: high to low' },
  { value: 'price:asc', label: 'Order total: low to high' },
];

// Options for the assessment filter; 100 is the API's page cap.
const ASSESSMENT_OPTIONS_QUERY = { limit: 100, sortBy: 'title', sortOrder: 'asc' } as const;

type IProps = {
  query: EvaluatorPurchasesQuery;
  onChange: (patch: Partial<EvaluatorPurchasesQuery>) => void;
};

const PurchasesFilters = ({ query, onChange }: IProps) => {
  const [search, setSearch] = useState(query.search ?? '');
  const [prevSearch, setPrevSearch] = useState(query.search);
  const { data: assessments } = useGetEvaluatorAssessments(ASSESSMENT_OPTIONS_QUERY);
  const options = assessments?.data ?? [];

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

  // A deep link may point at an assessment that isn't among the loaded options.
  const unknownAssessment =
    query.assessmentId && !options.some((a) => a.id === query.assessmentId);

  return (
    <div className='flex flex-col gap-3'>
      <div
        role='tablist'
        aria-label='Payment status'
        className='flex gap-1 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {TABS.map((tab) => {
          const active = query.paymentStatus === tab.value;
          return (
            <button
              key={tab.label}
              type='button'
              role='tab'
              aria-selected={active}
              onClick={() => onChange({ paymentStatus: tab.value })}
              className={cn(
                'inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                active
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
            placeholder='Search assessment, customer name or email'
            aria-label='Search sales by assessment title, customer name or email'
            className='pl-8'
          />
        </div>
        <select
          aria-label='Filter by assessment'
          className={cn(SELECT_CLASS, 'sm:max-w-64')}
          value={query.assessmentId ?? ''}
          onChange={(e) => onChange({ assessmentId: e.target.value || undefined })}
        >
          <option value=''>All assessments</option>
          {unknownAssessment && <option value={query.assessmentId}>Selected assessment</option>}
          {options.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
              {a.status === 'DELETED' ? ' (deleted)' : ''}
            </option>
          ))}
        </select>
        <select
          aria-label='Sort sales'
          className={SELECT_CLASS}
          value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(':');
            onChange({
              sortBy: sortBy as EvaluatorPurchasesQuery['sortBy'],
              sortOrder: sortOrder as EvaluatorPurchasesQuery['sortOrder'],
            });
          }}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      {query.customerId && (
        <div className='flex flex-wrap items-center gap-2 text-xs'>
          <span className='text-muted-foreground'>Filtered by</span>
          <button
            type='button'
            onClick={() => onChange({ customerId: undefined })}
            aria-label='Remove filter Single customer'
            className='inline-flex h-7 items-center gap-1 rounded-full border bg-background px-2.5 font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50'
          >
            Single customer
            <X className='size-3 text-muted-foreground' />
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchasesFilters;
