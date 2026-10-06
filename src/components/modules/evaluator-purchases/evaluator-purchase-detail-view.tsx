'use client';

import { ArrowLeft, Building2, Briefcase, Mail, UserRound } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FetchError } from 'ofetch';
import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import {
  deriveOrderStatus,
  formatDateTime,
  formatMoney,
  shortId,
} from '@/components/modules/admin-purchases/purchase-utils';
import UserAvatar from '@/components/modules/admin-users/user-avatar';
import AdjustPriceDialog from '@/components/modules/evaluator-purchases/adjust-price-dialog';
import PaymentTimeline from '@/components/modules/evaluator-purchases/payment-timeline';
import PurchaseLineItems from '@/components/modules/evaluator-purchases/purchase-line-items';
import {
  canAdjustPrice,
  customerName,
  otherItemsAmount,
} from '@/components/modules/evaluator-purchases/purchase-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEvaluatorPurchase } from '@/hooks';
import { cn } from '@/lib/utils';
import type { EvaluatorPurchaseRow } from '@/types/evaluator-purchases.types';

const BackLink = () => (
  <Link
    href='/evaluator/purchases'
    className='inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
  >
    <ArrowLeft className='size-4' /> Back to sales
  </Link>
);

const SummaryRow = ({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) => (
  <div className='flex items-center justify-between gap-3 text-sm'>
    <dt className='text-muted-foreground'>{label}</dt>
    <dd className={cn('text-right tabular-nums', strong && 'text-base font-semibold')}>{value}</dd>
  </div>
);

const EarningsCard = ({ order }: { order: EvaluatorPurchaseRow }) => {
  const paid = deriveOrderStatus(order.payments) === 'SUCCESS';
  const others = otherItemsAmount(order);
  const paidPayment = order.payments.find((p) => p.status === 'SUCCESS');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>
          {paid ? 'This order is paid and counts toward your revenue.' : 'Not paid yet, so nothing is earned.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className='flex flex-col gap-2.5'>
          <SummaryRow label='Your subtotal' value={formatMoney(order.subtotal)} strong />
          {others > 0 && (
            <SummaryRow label="Other evaluators' items" value={formatMoney(others)} />
          )}
          <Separator className='my-1' />
          <SummaryRow label='Order total' value={formatMoney(order.price)} />
          <SummaryRow label='Paid with' value={paidPayment?.method ?? 'N/A'} />
          <SummaryRow
            label='Paid on'
            value={paidPayment?.paidAt ? formatDateTime(paidPayment.paidAt) : 'N/A'}
          />
        </dl>
      </CardContent>
    </Card>
  );
};

const CustomerCard = ({ customer }: { customer: EvaluatorPurchaseRow['customer'] }) => {
  const details = [
    { icon: Mail, value: customer.email },
    { icon: Briefcase, value: customer.profession },
    { icon: Building2, value: customer.company },
  ].filter((d) => d.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <UserAvatar name={customer.name} email={customer.email} avatarUrl={customer.avatarUrl} />
          <p className='min-w-0 truncate font-medium'>{customerName(customer)}</p>
        </div>
        <ul className='flex flex-col gap-2 text-sm'>
          {details.map(({ icon: Icon, value }) => (
            <li key={value} className='flex min-w-0 items-center gap-2 text-muted-foreground'>
              <Icon className='size-4 shrink-0' />
              <span className='truncate'>{value}</span>
            </li>
          ))}
        </ul>
        <Button
          variant='outline'
          size='sm'
          nativeButton={false}
          render={<Link href={`/evaluator/purchases?customerId=${customer.id}`} />}
        >
          <UserRound /> All orders from this customer
        </Button>
      </CardContent>
    </Card>
  );
};

const DetailSkeleton = () => (
  <div className='flex flex-col gap-6'>
    <Skeleton className='h-4 w-28' />
    <div className='flex flex-col gap-2 border-b border-border/60 pb-5'>
      <Skeleton className='h-8 w-56' />
      <Skeleton className='h-4 w-72' />
    </div>
    <div className='grid gap-6 lg:grid-cols-3'>
      <div className='flex flex-col gap-6 lg:col-span-2'>
        <Skeleton className='h-48 rounded-xl' />
        <Skeleton className='h-56 rounded-xl' />
      </div>
      <div className='flex flex-col gap-6'>
        <Skeleton className='h-56 rounded-xl' />
        <Skeleton className='h-48 rounded-xl' />
      </div>
    </div>
  </div>
);

const EvaluatorPurchaseDetailView = ({ purchaseId }: { purchaseId: string }) => {
  const { data: order, isPending, error } = useGetEvaluatorPurchase(purchaseId);

  if (isPending && !error) return <DetailSkeleton />;

  if (!order) {
    // 404 also covers "none of your assessments in this order"; 400 covers a malformed id.
    if (error instanceof FetchError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <div className='flex flex-col gap-4'>
        <BackLink />
        <Card>
          <CardContent className='py-6 text-center text-sm text-muted-foreground'>
            We couldn&apos;t load this order. Please try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = deriveOrderStatus(order.payments);

  return (
    <div className='flex flex-col gap-6'>
      <BackLink />
      <div className='flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-5'>
        <div className='flex flex-col gap-1'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='font-heading text-2xl font-semibold tracking-tight sm:text-3xl'>
              Order <span className='font-mono'>#{shortId(order.id)}</span>
            </h1>
            <PurchaseStatusBadge status={status} />
          </div>
          <p className='text-sm text-muted-foreground'>
            Placed {formatDateTime(order.createdAt)} by {customerName(order.customer)}
          </p>
        </div>
        {canAdjustPrice(order) && <AdjustPriceDialog order={order} />}
      </div>

      <div className='grid items-start gap-6 lg:grid-cols-3'>
        <div className='flex flex-col gap-6 lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Your assessments ({order.assessments.length})</CardTitle>
              <CardDescription>
                Only your lines are shown; this order may include other evaluators&apos; items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseLineItems order={order} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment attempts</CardTitle>
              <CardDescription>
                Newest first. Amounts cover the whole order, not just your share.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTimeline payments={order.payments} />
            </CardContent>
          </Card>
        </div>
        <div className='flex flex-col gap-6'>
          <EarningsCard order={order} />
          <CustomerCard customer={order.customer} />
        </div>
      </div>
    </div>
  );
};

export default EvaluatorPurchaseDetailView;
