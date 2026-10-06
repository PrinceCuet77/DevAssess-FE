'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, CircleSlash, Loader2, Play, ShoppingBag, XCircle, type LucideIcon } from 'lucide-react';
import {
  deriveOrderStatus,
  formatDateTime,
  formatMoney,
  shortId,
} from '@/components/modules/admin-purchases/purchase-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDeveloperPurchase } from '@/hooks';
import { cn } from '@/lib/utils';

type IProps = {
  status: string;
  purchaseId: string;
  tranId?: string;
};

type Tone = 'success' | 'failed' | 'cancelled' | 'pending';

const TONES: Record<Tone, { icon: LucideIcon; ring: string; title: string; text: string }> = {
  success: {
    icon: CheckCircle2,
    ring: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    title: 'Payment successful',
    text: 'Your assessments are unlocked and ready whenever you are.',
  },
  failed: {
    icon: XCircle,
    ring: 'bg-destructive/10 text-destructive',
    title: 'Payment failed',
    text: 'The gateway could not complete your payment. You have not been charged for these assessments.',
  },
  cancelled: {
    icon: CircleSlash,
    ring: 'bg-muted text-muted-foreground',
    title: 'Payment cancelled',
    text: 'You cancelled the payment before it finished. Nothing was charged.',
  },
  pending: {
    icon: Loader2,
    ring: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    title: 'Payment not confirmed',
    text: 'We could not confirm this payment yet. If money left your account, it will show up here shortly.',
  },
};

// The query string only says what the gateway claims; the order's real state decides what we show.
const PaymentResultView = ({ status, purchaseId, tranId }: IProps) => {
  const queryClient = useQueryClient();
  const { data: order, isPending, isError } = useGetDeveloperPurchase(purchaseId);

  // New purchases change what the developer owns, so drop stale lists.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['developer-purchase-list'] });
    queryClient.invalidateQueries({ queryKey: ['developer-payment-list'] });
    queryClient.invalidateQueries({ queryKey: ['developer-owned-assessments'] });
    queryClient.invalidateQueries({ queryKey: ['developer-dashboard'] });
  }, [queryClient]);

  if (isPending) {
    return (
      <Card className='mx-auto w-full max-w-xl items-center gap-4 px-6 py-10' aria-busy>
        <Skeleton className='size-16 rounded-full' />
        <Skeleton className='h-6 w-48' />
        <Skeleton className='h-4 w-72' />
      </Card>
    );
  }

  const orderStatus = order ? deriveOrderStatus(order.payments) : undefined;
  const claimed = status === 'success' ? 'success' : status === 'cancelled' ? 'cancelled' : 'failed';
  let tone: Tone;
  if (orderStatus === 'SUCCESS') tone = 'success';
  else if (claimed === 'success') tone = 'pending'; // gateway said success but the order isn't paid
  else tone = claimed;

  const { icon: Icon, ring, title, text } = TONES[tone];
  const paid = order?.payments.find((p) => p.status === 'SUCCESS');

  return (
    <Card className='mx-auto w-full max-w-xl gap-0 overflow-hidden py-0'>
      <div className='flex flex-col items-center gap-3 px-6 pt-10 pb-6 text-center' role='status'>
        <div className={cn('flex size-16 items-center justify-center rounded-full', ring)}>
          <Icon className={cn('size-8', tone === 'pending' && 'animate-spin')} aria-hidden />
        </div>
        <h2 className='font-heading text-xl font-semibold'>{title}</h2>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {isError ? 'We couldn’t load the order details, but you can check your purchases.' : text}
        </p>
      </div>

      {order && (
        <div className='border-t px-6 py-4'>
          <dl className='grid grid-cols-2 gap-y-2 text-sm'>
            <dt className='text-muted-foreground'>Order</dt>
            <dd className='text-right font-mono text-xs'>#{shortId(order.id)}</dd>
            <dt className='text-muted-foreground'>Total</dt>
            <dd className='text-right font-semibold tabular-nums'>{formatMoney(order.price)}</dd>
            {paid && (
              <>
                <dt className='text-muted-foreground'>Paid</dt>
                <dd className='text-right'>{formatDateTime(paid.paidAt ?? paid.createdAt)}</dd>
                {paid.method && (
                  <>
                    <dt className='text-muted-foreground'>Method</dt>
                    <dd className='text-right'>{paid.method}</dd>
                  </>
                )}
              </>
            )}
            {tranId && (
              <>
                <dt className='text-muted-foreground'>Transaction</dt>
                <dd className='truncate text-right font-mono text-[11px]' title={tranId}>
                  {tranId}
                </dd>
              </>
            )}
          </dl>
          <ul className='mt-4 flex flex-col gap-2'>
            {order.assessments.map((a) => (
              <li key={a.id} className='flex items-center gap-3 rounded-lg bg-muted/40 p-2'>
                <AssessmentThumbnail src={a.thumbnailUrl} />
                <span className='min-w-0 flex-1 truncate text-sm font-medium'>{a.title}</span>
                {tone === 'success' && (
                  <Button
                    size='xs'
                    variant='outline'
                    nativeButton={false}
                    render={<Link href={`/developer/assessments/detail?id=${a.id}`} />}
                  >
                    <Play /> Open
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='flex flex-wrap items-center justify-center gap-2 border-t bg-muted/20 px-6 py-4'>
        {tone !== 'success' && order && orderStatus !== 'SUCCESS' && (
          <PayOrderButton purchaseId={order.id} label='Try again' />
        )}
        {tone === 'success' && (
          <Button nativeButton={false} render={<Link href='/developer/my-assessments' />}>
            Go to my assessments
          </Button>
        )}
        <Button variant='outline' nativeButton={false} render={<Link href='/developer/purchases' />}>
          <ShoppingBag /> View purchases
        </Button>
        <Button variant='ghost' nativeButton={false} render={<Link href='/developer/payments' />}>
          Payment history
        </Button>
      </div>
    </Card>
  );
};

export default PaymentResultView;
