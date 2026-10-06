'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import PaymentRow from '@/components/modules/developer-payments/payment-row';
import PaymentsEmptyState from '@/components/modules/developer-payments/payments-empty-state';
import PaymentsFilters from '@/components/modules/developer-payments/payments-filters';
import PaymentsSkeleton from '@/components/modules/developer-payments/payments-skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetDeveloperPaymentList } from '@/hooks';
import { cn } from '@/lib/utils';
import type { DeveloperPaymentsQuery } from '@/types/developer-assessments.types';

const STATUSES = ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED'] as const;
const SORT_KEYS = ['createdAt', 'amount', 'paidAt'] as const;

const parseQuery = (params: URLSearchParams): DeveloperPaymentsQuery => {
  const num = (key: string) => {
    const n = Number(params.get(key));
    return Number.isInteger(n) && n > 0 ? n : undefined;
  };
  const sortOrder = params.get('sortOrder');
  return {
    status: STATUSES.find((s) => s === params.get('status')),
    sortBy: SORT_KEYS.find((s) => s === params.get('sortBy')),
    sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
    page: num('page') ?? 1,
    limit: Math.min(num('limit') ?? 10, 100),
  };
};

const DeveloperPaymentsView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQuery(searchParams);
  const { data, isPending, isError, isFetching, refetch } = useGetDeveloperPaymentList(query);

  // Filters live in the URL so lists are shareable and back-button friendly.
  const update = useCallback(
    (patch: Partial<DeveloperPaymentsQuery>) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined) next.delete(key);
        else next.set(key, String(value));
      });
      if (!('page' in patch)) next.delete('page');
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const clearAll = () => update({ status: undefined, sortBy: undefined, sortOrder: undefined });
  const payments = data?.data ?? [];

  let content;
  if (isPending) {
    content = <PaymentsSkeleton />;
  } else if (isError) {
    content = (
      <Card className='items-center gap-3 px-4 py-12 text-center'>
        <p className='text-sm text-muted-foreground'>We couldn&apos;t load your payments. Please try again.</p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </Card>
    );
  } else if (payments.length === 0) {
    content = <PaymentsEmptyState filtered={Boolean(query.status)} onClear={clearAll} />;
  } else {
    content = (
      <Card className={cn('gap-0 py-0', isFetching && 'opacity-60 transition-opacity')}>
        <ul className='divide-y divide-border/60'>
          {payments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} />
          ))}
        </ul>
        {data?.meta && (
          <PaginationBar
            meta={data.meta}
            noun={['payment', 'payments']}
            onPageChange={(page) => update({ page })}
            onLimitChange={(limit) => update({ limit })}
          />
        )}
      </Card>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <PaymentsFilters query={query} onChange={update} />
      {content}
    </div>
  );
};

export default DeveloperPaymentsView;
