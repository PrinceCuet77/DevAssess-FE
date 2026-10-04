'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { AdminUsersQuery } from '@/types/admin-users.types';

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

const ROLES = ['DEVELOPER', 'EVALUATOR', 'ADMIN'] as const;
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
};

const UsersFilters = ({ query, onChange }: IProps) => {
  const [search, setSearch] = useState(query.search ?? '');

  // Debounce typing so we don't hit the rate-limited API on every keystroke.
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === (query.search ?? '')) return;
    const timer = setTimeout(() => onChange({ search: trimmed || undefined }), 400);
    return () => clearTimeout(timer);
  }, [search, query.search, onChange]);

  return (
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
        aria-label='Filter by role'
        className={SELECT_CLASS}
        value={query.role ?? ''}
        onChange={(e) => onChange({ role: (e.target.value || undefined) as AdminUsersQuery['role'] })}
      >
        <option value=''>All roles</option>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {pretty(r)}
          </option>
        ))}
      </select>
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
    </div>
  );
};

export default UsersFilters;
