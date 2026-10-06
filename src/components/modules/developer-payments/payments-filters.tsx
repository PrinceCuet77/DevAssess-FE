'use client';

import ClearFiltersButton from '@/components/shared/clear-filters-button';
import { cn } from '@/lib/utils';
import type { DeveloperPaymentsQuery } from '@/types/developer-assessments.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

const TABS = [
  { value: undefined, label: 'All' },
  { value: 'SUCCESS', label: 'Successful' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

const SORTS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'amount:desc', label: 'Amount: high to low' },
  { value: 'amount:asc', label: 'Amount: low to high' },
  { value: 'paidAt:desc', label: 'Recently paid' },
];

type IProps = {
  query: DeveloperPaymentsQuery;
  onChange: (patch: Partial<DeveloperPaymentsQuery>) => void;
};

const PaymentsFilters = ({ query, onChange }: IProps) => {
  const active = Boolean(query.status || query.sortBy || query.sortOrder);

  return (
    <div className='flex flex-col gap-3'>
      <div
        role='tablist'
        aria-label='Payment status'
        className='flex gap-1 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {TABS.map((tab) => {
          const selected = query.status === tab.value;
          return (
            <button
              key={tab.label}
              type='button'
              role='tab'
              aria-selected={selected}
              onClick={() => onChange({ status: tab.value })}
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
      <div className='flex flex-wrap items-center gap-3'>
        <select
          aria-label='Sort payments'
          className={SELECT_CLASS}
          value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(':');
            onChange({
              sortBy: sortBy as DeveloperPaymentsQuery['sortBy'],
              sortOrder: sortOrder as DeveloperPaymentsQuery['sortOrder'],
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
          onClear={() => onChange({ status: undefined, sortBy: undefined, sortOrder: undefined })}
        />
      </div>
    </div>
  );
};

export default PaymentsFilters;
