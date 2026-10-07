'use client';

import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { FetchError } from 'ofetch';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/layout/dashboard/page-header';
import CheckoutLine from '@/components/modules/developer-checkout/checkout-line';
import LineNotice from '@/components/modules/developer-checkout/line-notice';
import OrderSummaryCard from '@/components/modules/developer-checkout/order-summary-card';
import { useCheckout } from '@/components/modules/developer-checkout/use-checkout';
import { creatorName } from '@/components/modules/public-assessments/catalog-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart, useGetAssessment, useGetOwnedAssessments, useGetPendingOrders } from '@/hooks';

const back = (
  <Link
    href='/assessments'
    className='inline-flex w-fit items-center gap-1.5 rounded text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
  >
    <ArrowLeft className='size-4' /> Back to assessments
  </Link>
);

// "Buy now": a one-item order that skips the cart.
const CheckoutView = () => {
  const assessmentId = useSearchParams().get('assessmentId');
  if (!assessmentId) notFound();

  const { data: assessment, isPending, isError, error, refetch } = useGetAssessment(assessmentId);
  const owned = useGetOwnedAssessments();
  const pending = useGetPendingOrders();
  const cart = useCart();
  // If it was also in the cart, it's in an order now.
  const checkout = useCheckout({ onOrderCreated: () => cart.remove(assessmentId) });

  if (isError && error instanceof FetchError && (error.statusCode === 404 || error.statusCode === 400)) notFound();

  if (isPending || owned.isPending) {
    return (
      <div className='flex flex-col gap-6'>
        {back}
        <Skeleton className='h-16 w-72' />
        <div className='grid gap-6 lg:grid-cols-[1fr_22rem]'>
          <Skeleton className='h-64 rounded-xl' />
          <Skeleton className='h-64 rounded-xl' />
        </div>
      </div>
    );
  }

  if (isError || !assessment) {
    return (
      <div className='flex flex-col gap-6'>
        {back}
        <Card className='items-center gap-3 px-4 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>We couldn&apos;t load this assessment.</p>
          <Button variant='outline' onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const isOwned = owned.data?.some((a) => a.id === assessment.id) ?? false;
  const item = {
    id: assessment.id,
    title: assessment.title,
    price: assessment.price,
    thumbnailUrl: assessment.thumbnailUrl,
    tags: assessment.tags,
    duration: assessment.duration,
    passingPercentage: assessment.passingPercentage,
    creatorName: creatorName(assessment.creator),
  };

  return (
    <div className='flex flex-col gap-6'>
      {back}
      <PageHeader title='Checkout' description='Review your order and pay securely with SSLCommerz.' />

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_22rem]'>
        <Card>
          <CardHeader>
            <CardTitle>Your order</CardTitle>
            <CardDescription>1 assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              <CheckoutLine
                item={item}
                muted={isOwned}
                notice={<LineNotice owned={false} pendingOrder={isOwned ? undefined : pending.data?.[assessment.id]} />}
              />
            </ul>
          </CardContent>
        </Card>

        {isOwned ? (
          <Card className='lg:sticky lg:top-24'>
            <CardContent className='flex flex-col gap-3'>
              <p role='status' className='rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400'>
                You already own this assessment.
              </p>
              <Button nativeButton={false} render={<Link href={`/developer/assessments/detail?id=${assessment.id}`} />}>
                Go to assessment <ArrowRight />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <OrderSummaryCard
            count={1}
            total={Number(assessment.price)}
            stage={checkout.stage}
            repriced={checkout.repriced}
            onCheckout={() => checkout.placeOrder([item])}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutView;
