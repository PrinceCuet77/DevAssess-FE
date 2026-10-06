'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import PurchasesEmptyState from '@/components/modules/evaluator-purchases/purchases-empty-state';
import PurchasesFilters from '@/components/modules/evaluator-purchases/purchases-filters';
import PurchasesTable from '@/components/modules/evaluator-purchases/purchases-table';
import SalesSummary from '@/components/modules/evaluator-purchases/sales-summary';
import DataTableCard from '@/components/ui/data-table-card';
import { DataTableSkeleton } from '@/components/ui/data-table';
import { useGetEvaluatorPurchaseList } from '@/hooks';
import type { EvaluatorPurchasesQuery } from '@/types/evaluator-purchases.types';

const parseQuery = (params: URLSearchParams): EvaluatorPurchasesQuery => {
  const num = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const get = <T extends string>(key: string) => (params.get(key) || undefined) as T | undefined;
  return {
    paymentStatus: get('paymentStatus'),
    assessmentId: get('assessmentId'),
    customerId: get('customerId'),
    search: get('search'),
    sortBy: get('sortBy'),
    sortOrder: get('sortOrder'),
    page: num('page') ?? 1,
    limit: Math.min(num('limit') ?? 10, 100),
  };
};

const EvaluatorPurchasesView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQuery(searchParams);
  const { data, isPending, isError, isFetching } = useGetEvaluatorPurchaseList(query);

  // Filters live in the URL so lists are shareable and back-button friendly.
  const update = useCallback(
    (patch: Partial<EvaluatorPurchasesQuery>) => {
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

  const purchases = data?.data ?? [];

  return (
    <div className='flex flex-col gap-6'>
      <SalesSummary />
      <div className='flex flex-col gap-4'>
        <PurchasesFilters query={query} onChange={update} />
        <DataTableCard
          isPending={isPending}
          isError={isError}
          isEmpty={purchases.length === 0}
          isFetching={isFetching}
          errorMessage="We couldn't load your sales. Please try again."
          skeleton={<DataTableSkeleton leadingRound />}
          empty={<PurchasesEmptyState query={query} onChange={update} />}
          footer={
            data?.meta && (
              <PaginationBar
                meta={data.meta}
                noun={['order', 'orders']}
                onPageChange={(page) => update({ page })}
                onLimitChange={(limit) => update({ limit })}
              />
            )
          }
        >
          <PurchasesTable purchases={purchases} />
        </DataTableCard>
        <p className='text-xs text-muted-foreground'>
          Orders can include other evaluators&apos; assessments; you only see your own lines.
          Unpaid and failed orders are listed but don&apos;t count toward revenue.
        </p>
      </div>
    </div>
  );
};

export default EvaluatorPurchasesView;
