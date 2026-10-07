'use client';

import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { FetchError } from 'ofetch';
import { ArrowLeft, ArrowRight, Clock, CreditCard, Loader2, LockKeyhole, ShieldCheck, Target } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/layout/dashboard/page-header';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import AssessmentCover from '@/components/modules/public-assessments/assessment-cover';
import { creatorName, formatDuration } from '@/components/modules/public-assessments/catalog-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreatePayment, useCreatePurchase, useGetAssessment, useGetOwnedAssessments } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';

const back = (
  <Link
    href='/assessments'
    className='inline-flex w-fit items-center gap-1.5 rounded text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
  >
    <ArrowLeft className='size-4' /> Back to assessments
  </Link>
);

const CheckoutView = () => {
  const assessmentId = useSearchParams().get('assessmentId');
  if (!assessmentId) notFound();

  const { data: assessment, isPending, isError, error, refetch } = useGetAssessment(assessmentId);
  const owned = useGetOwnedAssessments();
  const purchase = useCreatePurchase();
  const payment = useCreatePayment();
  // Stay busy through the gateway redirect so the order can't be placed twice.
  const busy = purchase.isPending || payment.isPending || payment.isSuccess;

  if (isError && error instanceof FetchError && (error.statusCode === 404 || error.statusCode === 400)) notFound();

  const handlePay = () => {
    purchase.mutate([assessmentId], {
      onSuccess: (order) =>
        payment.mutate(order.data.id, {
          onSuccess: (res) => {
            window.location.href = res.data.gatewayPageURL;
          },
          // The order exists now, so the developer can retry from Purchases.
          onError: (err) =>
            toast.error(getApiErrorMessage(err, 'Your order was created but payment could not start. Retry from Purchases.')),
        }),
      onError: (err) => toast.error(getApiErrorMessage(err, 'Could not create your order. Please try again.')),
    });
  };

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

  const isOwned = owned.data?.some((a) => a.id === assessment.id);

  return (
    <div className='flex flex-col gap-6'>
      {back}
      <PageHeader title='Checkout' description='Review your order and pay securely with SSLCommerz.' />

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_22rem]'>
        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
            <CardDescription>1 assessment</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 sm:flex-row'>
            <AssessmentCover
              id={assessment.id}
              title={assessment.title}
              tags={assessment.tags}
              src={assessment.thumbnailUrl}
              className='aspect-[16/9] w-full shrink-0 rounded-lg sm:w-48'
            />
            <div className='flex min-w-0 flex-1 flex-col gap-2'>
              <Link
                href={`/assessments/detail?id=${assessment.id}`}
                className='font-heading text-base font-semibold hover:underline'
              >
                {assessment.title}
              </Link>
              <p className='text-xs text-muted-foreground'>by {creatorName(assessment.creator)}</p>
              <p className='line-clamp-2 text-sm text-muted-foreground'>{assessment.description}</p>
              <div className='mt-auto flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <Clock className='size-3.5' aria-hidden /> {formatDuration(assessment.duration)}
                </span>
                <span className='flex items-center gap-1'>
                  <Target className='size-3.5' aria-hidden /> Pass {assessment.passingPercentage}%
                </span>
              </div>
            </div>
            <span className='shrink-0 text-sm font-semibold tabular-nums sm:text-right'>{formatMoney(assessment.price)}</span>
          </CardContent>
        </Card>

        <Card className='lg:sticky lg:top-24'>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <dl className='flex flex-col gap-2 text-sm'>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>Subtotal</dt>
                <dd className='tabular-nums'>{formatMoney(assessment.price)}</dd>
              </div>
              <div className='flex justify-between border-t border-border/60 pt-2 text-base font-semibold'>
                <dt>Total</dt>
                <dd className='tabular-nums'>{formatMoney(assessment.price)}</dd>
              </div>
            </dl>

            {isOwned ? (
              <>
                <p role='status' className='rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400'>
                  You already own this assessment.
                </p>
                <Button nativeButton={false} render={<Link href={`/developer/assessments/detail?id=${assessment.id}`} />}>
                  Go to assessment <ArrowRight />
                </Button>
              </>
            ) : (
              <Button size='lg' className='h-11 w-full text-base' disabled={busy} onClick={handlePay}>
                {busy ? <Loader2 className='animate-spin' /> : <CreditCard />}
                {purchase.isPending ? 'Creating order…' : busy ? 'Redirecting to payment…' : `Pay ${formatMoney(assessment.price)}`}
              </Button>
            )}

            <ul className='flex flex-col gap-2 text-xs text-muted-foreground'>
              <li className='flex items-center gap-2'>
                <LockKeyhole className='size-3.5 shrink-0' aria-hidden /> You&apos;ll finish payment on the secure SSLCommerz page.
              </li>
              <li className='flex items-center gap-2'>
                <ShieldCheck className='size-3.5 shrink-0' aria-hidden /> Unpaid orders stay in Purchases so you can pay later.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutView;
