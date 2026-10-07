'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Clock, Play, Target } from 'lucide-react';
import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import {
  deriveOrderStatus,
  formatDateTime,
  formatMoney,
  shortId,
  type OrderStatus,
} from '@/components/modules/admin-purchases/purchase-utils';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import PaymentTimeline from '@/components/modules/evaluator-purchases/payment-timeline';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DeveloperPurchase } from '@/types/developer-assessments.types';

const PAY_LABEL: Partial<Record<OrderStatus, string>> = {
  UNPAID: 'Pay now',
  PENDING: 'Complete payment',
  FAILED: 'Try again',
  CANCELLED: 'Pay now',
};

const HINT: Partial<Record<OrderStatus, string>> = {
  UNPAID: 'You haven’t paid for this order yet.',
  PENDING: 'Your last payment never completed. You can start a new one.',
  FAILED: 'Your last payment failed. No assessments were unlocked.',
  CANCELLED: 'You cancelled the last payment. No assessments were unlocked.',
  REFUNDED: 'This order was refunded.',
};

const PurchaseCard = ({ order, defaultOpen = false }: { order: DeveloperPurchase; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  const status = deriveOrderStatus(order.payments);
  const paid = order.payments.find((p) => p.status === 'SUCCESS');
  const payLabel = PAY_LABEL[status];
  const historyId = `payments-${order.id}`;

  return (
    <Card className='gap-0 overflow-hidden py-0'>
      <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-muted/30 px-4 py-3'>
        <div className='flex flex-col'>
          <Link
            href={`/developer/purchases/detail?id=${order.id}`}
            className='w-fit rounded font-mono text-xs font-medium outline-none hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50'
          >
            Order #{shortId(order.id)}
          </Link>
          <span className='text-xs text-muted-foreground'>
            Placed {formatDateTime(order.createdAt)}
          </span>
        </div>
        <div className='flex items-center gap-4'>
          <PurchaseStatusBadge status={status} />
          <div className='text-right'>
            <p className='text-sm font-semibold tabular-nums'>{formatMoney(order.price)}</p>
            <p className='text-[11px] text-muted-foreground'>
              {order.assessments.length} {order.assessments.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
      </div>

      <ul className='divide-y divide-border/60'>
        {order.assessments.map((a) => (
          <li key={a.id} className='flex items-center gap-3 px-4 py-3'>
            <AssessmentThumbnail src={a.thumbnailUrl} className='size-12' />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium'>{a.title}</p>
              <p className='mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground'>
                <span className='truncate'>by {a.creator.name ?? a.creator.email}</span>
                <span className='inline-flex items-center gap-1'>
                  <Clock className='size-3' aria-hidden /> {a.duration} min
                </span>
                <span className='inline-flex items-center gap-1'>
                  <Target className='size-3' aria-hidden /> Pass {a.passingPercentage}%
                </span>
              </p>
            </div>
            <div className='flex shrink-0 flex-col items-end gap-1.5'>
              <span className='text-sm tabular-nums'>{formatMoney(a.price)}</span>
              {status === 'SUCCESS' && (
                <Button
                  size='xs'
                  variant='outline'
                  nativeButton={false}
                  render={<Link href={`/developer/assessments/detail?id=${a.id}`} />}
                >
                  <Play /> Open
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className='flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3'>
        <div className='min-w-0 text-xs text-muted-foreground'>
          {status === 'SUCCESS' && paid ? (
            <p>
              Paid {formatDateTime(paid.paidAt ?? paid.createdAt)}
              {paid.method ? ` via ${paid.method}` : ''}
            </p>
          ) : (
            <p>{HINT[status]}</p>
          )}
          {order.payments.length > 0 && (
            <button
              type='button'
              aria-expanded={open}
              aria-controls={historyId}
              onClick={() => setOpen((v) => !v)}
              className='mt-1 inline-flex items-center gap-1 rounded font-medium text-foreground outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50'
            >
              Payment history ({order.payments.length})
              <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
            </button>
          )}
        </div>
        {payLabel && <PayOrderButton purchaseId={order.id} label={payLabel} />}
        {status === 'SUCCESS' && order.assessments.length === 1 && (
          <Button
            nativeButton={false}
            render={
              <Link href={`/developer/assessments/detail/take?id=${order.assessments[0].id}`} />
            }
          >
            <Play /> Start assessment
          </Button>
        )}
      </div>

      {open && (
        <div id={historyId} className='border-t bg-muted/20 px-4 py-4'>
          <PaymentTimeline payments={order.payments} />
        </div>
      )}
    </Card>
  );
};

export default PurchaseCard;
