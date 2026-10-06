'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminDashboardStats } from '@/types/admin-dashboard.types';
import { Input } from '@/components/ui/input';
import ClearFiltersButton from '@/components/shared/clear-filters-button';
import type { AdminUsersQuery } from '@/types/admin-users.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

const TABS = [
  { value: undefined, label: 'All' },
  { value: 'DEVELOPER', label: 'Developers' },
  { value: 'EVALUATOR', label: 'Evaluators' },
  { value: 'ADMIN', label: 'Admins' },
] as const;
const STATUSES = ['VERIFIED', 'NOT_VERIFIED', 'SUSPENDED', 'DELETED'] as const;
const SORTS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'name:asc', label: 'Name A–Z' },
  { value: 'name:desc', label: 'Name Z–A' },
  { value: 'email:asc', label: 'Email A–Z' },
  { value: 'email:desc', label: 'Email Z–A' },
];

const pretty = (v: string) => v.charAt(0) + v.slice(1).toLowerCase().replaceAll('_', ' ');

type IProps = {
  query: AdminUsersQuery;
  onChange: (patch: Partial<AdminUsersQuery>) => void;
  counts?: AdminDashboardStats;
};

const UsersFilters = ({ query, onChange, counts }: IProps) => {
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

  const hasActiveFilters = Boolean(query.role || query.status || query.search || query.sortBy || query.sortOrder);
  const clearAll = () => onChange({ role: undefined, status: undefined, search: undefined, sortBy: undefined, sortOrder: undefined });

  return (
    <div className='flex flex-col gap-3'>
      <div
        role='tablist'
        aria-label='User role'
        className='flex gap-1 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {TABS.map((tab) => {
          const active = query.role === tab.value;
          const count =
            counts && (tab.value ? (counts.usersByRole[tab.value] ?? 0) : counts.totalUsers);
          return (
            <button
              key={tab.label}
              type='button'
              role='tab'
              aria-selected={active}
              onClick={() => onChange({ role: tab.value })}
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
          placeholder='Search name or email'
          aria-label='Search users'
          className='pl-8'
        />
      </div>
      <select
        aria-label='Filter by status'
        className={SELECT_CLASS}
        value={query.status ?? ''}
        onChange={(e) =>
          onChange({ status: (e.target.value || undefined) as AdminUsersQuery['status'] })
        }
      >
        <option value=''>All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {pretty(s)}
          </option>
        ))}
      </select>
      <select
        aria-label='Sort users'
        className={SELECT_CLASS}
        value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(':');
          onChange({
            sortBy: sortBy as AdminUsersQuery['sortBy'],
            sortOrder: sortOrder as AdminUsersQuery['sortOrder'],
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

export default UsersFilters;
