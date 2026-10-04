'use client';

import { useCallback } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AssessmentsEmptyState from '@/components/modules/evaluator-assessments/assessments-empty-state';
import AssessmentsFilters from '@/components/modules/evaluator-assessments/assessments-filters';
import AssessmentsTable, {
  AssessmentsTableSkeleton,
} from '@/components/modules/evaluator-assessments/assessments-table';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetEvaluatorAssessments, useGetEvaluatorDashboard } from '@/hooks';
import type { EvaluatorAssessmentsQuery } from '@/types/evaluator-assessments.types';

const parseQuery = (params: URLSearchParams): EvaluatorAssessmentsQuery => {
  const int = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const price = (key: string) => {
    const raw = params.get(key);
    const n = raw === null || raw === '' ? NaN : Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const get = <T extends string>(key: string) => (params.get(key) || undefined) as T | undefined;
  return {
    status: get('status'),
    search: get('search'),
    duration: int('duration'),
    minPrice: price('minPrice'),
    maxPrice: price('maxPrice'),
    sortBy: get('sortBy'),
    sortOrder: get('sortOrder'),
    page: int('page') ?? 1,
    limit: Math.min(int('limit') ?? 10, 100),
  };
};

const EvaluatorAssessmentsView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQuery(searchParams);
  const { data, isPending, isError, isFetching } = useGetEvaluatorAssessments(query);

  // Filters live in the URL so lists are shareable and back-button friendly.
  const update = useCallback(
    (patch: Partial<EvaluatorAssessmentsQuery>) => {
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

  // Tab counts come from the (cached) dashboard stats; tabs still work without them.
  const { data: dashboard } = useGetEvaluatorDashboard();

  // The API has no "exclude deleted" filter, so hide them client-side unless the Deleted tab is open.
  const rows = data?.data ?? [];
  const assessments = query.status ? rows : rows.filter((a) => a.status !== 'DELETED');
  const hiddenDeleted = rows.length - assessments.length;

  return (
    <div className='flex flex-col gap-4'>
      <AssessmentsFilters query={query} onChange={update} stats={dashboard?.stats} />
      <Card className='gap-0 py-0'>
        <CardContent className='p-0'>
          {isPending ? (
            <AssessmentsTableSkeleton />
          ) : isError ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              We couldn&apos;t load your assessments. Please try again.
            </p>
          ) : assessments.length === 0 ? (
            <AssessmentsEmptyState query={query} onChange={update} />
          ) : (
            <div className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
              <AssessmentsTable assessments={assessments} />
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
      {hiddenDeleted > 0 && (
        <p className='text-xs text-muted-foreground'>
          {hiddenDeleted} deleted {hiddenDeleted === 1 ? 'assessment is' : 'assessments are'} hidden
          on this page. Open the Deleted tab to see them.
        </p>
      )}
    </div>
  );
};

export const NewAssessmentButton = () => (
  <Button render={<Link href='/evaluator/assessments/new' />}>
    <Plus />
    New assessment
  </Button>
);

export default EvaluatorAssessmentsView;
