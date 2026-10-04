'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AssessmentsEmptyState from '@/components/modules/admin-assessments/assessments-empty-state';
import AssessmentsFilters from '@/components/modules/admin-assessments/assessments-filters';
import AssessmentsTable, {
  AssessmentsTableSkeleton,
} from '@/components/modules/admin-assessments/assessments-table';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAdminAssessments, useGetAdminDashboard } from '@/hooks';
import type { AdminAssessmentsQuery } from '@/types/admin-assessments.types';

const parseQuery = (params: URLSearchParams): AdminAssessmentsQuery => {
  const num = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const get = <T extends string>(key: string) => (params.get(key) || undefined) as T | undefined;
  return {
    status: get('status'),
    creatorId: get('creatorId'),
    tags: get('tags'),
    search: get('search'),
    sortBy: get('sortBy'),
    sortOrder: get('sortOrder'),
    page: num('page') ?? 1,
    limit: Math.min(num('limit') ?? 10, 100),
  };
};

const AdminAssessmentsView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQuery(searchParams);
  const { data, isPending, isError, isFetching } = useGetAdminAssessments(query);

  // Filters live in the URL so lists are shareable and back-button friendly.
  const update = useCallback(
    (patch: Partial<AdminAssessmentsQuery>) => {
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

  const addTag = (tag: string) => {
    const current = query.tags?.split(',').filter(Boolean) ?? [];
    if (!current.includes(tag)) update({ tags: [...current, tag].join(',') });
  };

  // Tab counts come from the (cached) dashboard stats; tabs still work without them.
  const { data: dashboard } = useGetAdminDashboard();

  const assessments = data?.data ?? [];

  return (
    <div className='flex flex-col gap-4'>
      <AssessmentsFilters query={query} onChange={update} counts={dashboard?.stats} />
      <Card className='gap-0 py-0'>
        <CardContent className='p-0'>
          {isPending ? (
            <AssessmentsTableSkeleton />
          ) : isError ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              We couldn&apos;t load assessments. Please try again.
            </p>
          ) : assessments.length === 0 ? (
            <AssessmentsEmptyState query={query} onChange={update} />
          ) : (
            <div className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
              <AssessmentsTable assessments={assessments} onTagClick={addTag} />
            </div>
          )}
          {data?.meta && (
            <PaginationBar
              meta={data.meta}
              noun={['assessment', 'assessments']}
              onPageChange={(page) => update({ page })}
              onLimitChange={(limit) => update({ limit })}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAssessmentsView;
