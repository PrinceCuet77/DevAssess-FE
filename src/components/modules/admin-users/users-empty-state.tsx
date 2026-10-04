import { SearchX, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminUsersQuery } from '@/types/admin-users.types';

const pretty = (v: string) => v.charAt(0) + v.slice(1).toLowerCase().replaceAll('_', ' ');

type IProps = {
  query: AdminUsersQuery;
  onChange: (patch: Partial<AdminUsersQuery>) => void;
};

const UsersEmptyState = ({ query, onChange }: IProps) => {
  const filters = [
    query.search && {
      key: 'search',
      label: `Search: “${query.search}”`,
      clear: { search: undefined },
    },
    query.role && { key: 'role', label: `Role: ${pretty(query.role)}`, clear: { role: undefined } },
    query.status && {
      key: 'status',
      label: `Status: ${pretty(query.status)}`,
      clear: { status: undefined },
    },
  ].filter(Boolean) as { key: string; label: string; clear: Partial<AdminUsersQuery> }[];

  const hasFilters = filters.length > 0;
  const Icon = hasFilters ? SearchX : Users;

  return (
    <div className='flex flex-col items-center gap-3 px-4 py-12 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>
          {hasFilters ? 'No users found' : 'No users yet'}
        </h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {hasFilters
            ? 'Nothing matches your current filters. Try removing one, or check the spelling of your search.'
            : 'Users will appear here once they sign up.'}
        </p>
      </div>
      {hasFilters && (
        <>
          <div className='flex flex-wrap justify-center gap-2'>
            {filters.map((f) => (
              <button
                key={f.key}
                type='button'
                onClick={() => onChange(f.clear)}
                aria-label={`Remove filter ${f.label}`}
                className='inline-flex h-7 items-center gap-1 rounded-full border bg-background px-2.5 text-xs font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50'
              >
                {f.label}
                <X className='size-3 text-muted-foreground' />
              </button>
            ))}
          </div>
          <Button
            variant='outline'
            onClick={() => onChange({ search: undefined, role: undefined, status: undefined })}
          >
            Clear all filters
          </Button>
        </>
      )}
    </div>
  );
};

export default UsersEmptyState;
