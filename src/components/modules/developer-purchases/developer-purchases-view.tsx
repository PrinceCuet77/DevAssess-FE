'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import PurchaseCard from '@/components/modules/developer-purchases/purchase-card';
import PurchasesEmptyState from '@/components/modules/developer-purchases/purchases-empty-state';
import PurchasesFilters from '@/components/modules/developer-purchases/purchases-filters';
import PurchasesSkeleton from '@/components/modules/developer-purchases/purchases-skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetDeveloperPurchaseList } from '@/hooks';
import { cn } from '@/lib/utils';
import type { DeveloperPurchasesQuery } from '@/types/developer-assessments.types';

const STATUSES = ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED'] as const;

const parseQuery = (params: URLSearchParams): DeveloperPurchasesQuery => {
  const num = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const status = params.get('paymentStatus');
  const sortBy = params.get('sortBy');
  const sortOrder = params.get('sortOrder');
  return {
    paymentStatus: STATUSES.find((s) => s === status),
    search: params.get('search') || undefined,
    sortBy: sortBy === 'createdAt' || sortBy === 'price' ? sortBy : undefined,
    sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
    page: num('page') ?? 1,
    limit: Math.min(num('limit') ?? 10, 100),
  };
};

const DeveloperPurchasesView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQuery(searchParams);
  const { data, isPending, isError, isFetching, refetch } = useGetDeveloperPurchaseList(query);

  // Filters live in the URL so lists are shareable and back-button friendly.
  const update = useCallback(
    (patch: Partial<DeveloperPurchasesQuery>) => {
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

  const clearAll = () =>
    update({ paymentStatus: undefined, search: undefined, sortBy: undefined, sortOrder: undefined });
  const filtered = Boolean(query.paymentStatus || query.search);
  const purchases = data?.data ?? [];

  let content;
  if (isPending) {
    content = <PurchasesSkeleton />;
  } else if (isError) {
    content = (
      <Card className='items-center gap-3 px-4 py-12 text-center'>
        <p className='text-sm text-muted-foreground'>
          We couldn&apos;t load your purchases. Please try again.
        </p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </Card>
    );
  } else if (purchases.length === 0) {
    content = <PurchasesEmptyState filtered={filtered} onClear={clearAll} />;
  } else {
    content = (
      <div className={cn('flex flex-col gap-4', isFetching && 'opacity-60 transition-opacity')}>
        {purchases.map((order) => (
          <PurchaseCard key={order.id} order={order} />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <PurchasesFilters query={query} onChange={update} />
      {content}
      {data?.meta && purchases.length > 0 && (
        <Card className='py-0'>
          <PaginationBar
            meta={data.meta}
            noun={['order', 'orders']}
            onPageChange={(page) => update({ page })}
            onLimitChange={(limit) => update({ limit })}
          />
        </Card>
      )}
    </div>
  );
};

export default DeveloperPurchasesView;
