'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FetchError } from 'ofetch';
import { ArrowLeft } from 'lucide-react';
import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import { formatDateTime, formatMoney, shortId } from '@/components/modules/admin-purchases/purchase-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import { canRetry } from '@/components/modules/developer-payments/payment-row';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDeveloperPayment } from '@/hooks';

const Field = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div className='flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4'>
    <dt className='text-sm text-muted-foreground'>{label}</dt>
    <dd className={mono ? 'font-mono text-xs break-all sm:text-right' : 'text-sm font-medium sm:text-right'}>
      {value}
    </dd>
  </div>
);

const PaymentDetailView = ({ paymentId }: { paymentId: string }) => {
  const { data: payment, isPending, isError, error, refetch } = useGetDeveloperPayment(paymentId);

  if (isError && error instanceof FetchError && (error.statusCode === 404 || error.statusCode === 400)) {
    notFound();
  }

  const back = (
    <Link
      href='/developer/payments'
      className='inline-flex w-fit items-center gap-1.5 rounded text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
    >
      <ArrowLeft className='size-4' /> Back to payments
    </Link>
  );

  if (isPending) {
    return (
      <div className='flex flex-col gap-6'>
        {back}
        <Skeleton className='h-28 w-full rounded-xl' />
        <div className='grid gap-6 lg:grid-cols-2'>
          <Skeleton className='h-64 rounded-xl' />
          <Skeleton className='h-64 rounded-xl' />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col gap-6'>
        {back}
        <Card className='items-center gap-3 px-4 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>We couldn&apos;t load this payment.</p>
          <Button variant='outline' onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const { purchase } = payment;

  return (
    <div className='flex flex-col gap-6'>
      {back}

      <Card>
        <CardContent className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-3'>
              <span className='font-heading text-3xl font-semibold tabular-nums'>
                {formatMoney(payment.amount, payment.currency)}
              </span>
              <PurchaseStatusBadge status={payment.status} />
            </div>
            <p className='text-sm text-muted-foreground'>
              {payment.paidAt
                ? `Paid ${formatDateTime(payment.paidAt)}`
                : `Started ${formatDateTime(payment.createdAt)}`}
            </p>
          </div>
          {canRetry(payment.status) && <PayOrderButton purchaseId={purchase.id} label='Try again' />}
        </CardContent>
      </Card>

      <div className='grid gap-6 lg:grid-cols-[1fr_24rem]'>
        <Card>
          <CardHeader>
            <CardTitle>Items in this order</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            <ul className='flex flex-col divide-y divide-border/60'>
              {purchase.assessments.map((a) => (
                <li key={a.id} className='flex items-center gap-3 py-3 first:pt-0'>
                  <AssessmentThumbnail src={a.thumbnailUrl} className='size-12' />
                  <p className='min-w-0 flex-1 truncate text-sm font-medium'>{a.title}</p>
                  <span className='text-sm tabular-nums'>{formatMoney(a.price)}</span>
                </li>
              ))}
            </ul>
            <div className='flex items-center justify-between border-t pt-3 text-sm font-semibold'>
              <span>Order total</span>
              <span className='tabular-nums'>{formatMoney(purchase.price)}</span>
            </div>
            <Button
              variant='outline'
              className='w-fit'
              nativeButton={false}
              render={<Link href='/developer/purchases' />}
            >
              View in purchases
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className='flex flex-col gap-3'>
              <Field label='Transaction ID' value={payment.transactionId} mono />
              {payment.valId && <Field label='Validation ID' value={payment.valId} mono />}
              <Field label='Method' value={payment.method ?? 'N/A'} />
              <Field label='Currency' value={payment.currency} />
              <Field label='Order' value={`#${shortId(purchase.id)}`} />
              <Field label='Created' value={formatDateTime(payment.createdAt)} />
              <Field label='Last updated' value={formatDateTime(payment.updatedAt)} />
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDetailView;
