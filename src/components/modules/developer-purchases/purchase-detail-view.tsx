'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FetchError } from 'ofetch';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/layout/dashboard/page-header';
import { shortId } from '@/components/modules/admin-purchases/purchase-utils';
import PurchaseCard from '@/components/modules/developer-purchases/purchase-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDeveloperPurchase } from '@/hooks';

const back = (
  <Link
    href='/developer/purchases'
    className='inline-flex w-fit items-center gap-1.5 rounded text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
  >
    <ArrowLeft className='size-4' /> Back to purchases
  </Link>
);

const PurchaseDetailView = ({ purchaseId }: { purchaseId: string }) => {
  const { data: order, isPending, isError, error, refetch } = useGetDeveloperPurchase(purchaseId);

  if (isError && error instanceof FetchError && (error.statusCode === 404 || error.statusCode === 400)) notFound();

  if (isPending) {
    return (
      <div className='flex flex-col gap-6'>
        {back}
        <Skeleton className='h-16 w-72' />
        <Skeleton className='h-64 w-full rounded-xl' />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className='flex flex-col gap-6'>
        {back}
        <Card className='items-center gap-3 px-4 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>We couldn&apos;t load this order.</p>
          <Button variant='outline' onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {back}
      <PageHeader title={`Order #${shortId(order.id)}`} description='Items, payment status and payment history for this order.' />
      <PurchaseCard order={order} defaultOpen />
    </div>
  );
};

export default PurchaseDetailView;
