'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import UsersFilters from '@/components/modules/admin-users/users-filters';
import UsersTable, { UsersTableSkeleton } from '@/components/modules/admin-users/users-table';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAdminUsers } from '@/hooks';
import type { AdminUsersQuery } from '@/types/admin-users.types';

const parseQuery = (params: URLSearchParams): AdminUsersQuery => {
  const num = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const get = <T extends string>(key: string) => (params.get(key) || undefined) as T | undefined;
  return {
    role: get('role'),
    status: get('status'),
    search: get('search'),
    sortBy: get('sortBy'),
    sortOrder: get('sortOrder'),
    page: num('page') ?? 1,
    limit: Math.min(num('limit') ?? 10, 100),
  };
};

const AdminUsersView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQuery(searchParams);
  const { data, isPending, isError, isFetching } = useGetAdminUsers(query);

  // Filters live in the URL so lists are shareable and back-button friendly.
  const update = useCallback(
    (patch: Partial<AdminUsersQuery>) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      // Any change other than paging itself returns to the first page.
      if (!('page' in patch)) next.delete('page');
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const users = data?.data ?? [];

  return (
    <div className='flex flex-col gap-4'>
      <UsersFilters query={query} onChange={update} />
      <Card className='gap-0 py-0'>
        <CardContent className='p-0'>
          {isPending ? (
            <UsersTableSkeleton />
          ) : isError ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              We couldn&apos;t load users. Please try again.
            </p>
          ) : users.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              No users match your filters.
            </p>
          ) : (
            <div className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
              <UsersTable users={users} />
            </div>
          )}
          {data?.meta && (
            <PaginationBar
              meta={data.meta}
              onPageChange={(page) => update({ page })}
              onLimitChange={(limit) => update({ limit })}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersView;
