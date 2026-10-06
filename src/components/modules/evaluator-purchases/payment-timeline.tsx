import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import { formatDateTime, formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import { cn } from '@/lib/utils';
import type { EvaluatorPurchasePayment } from '@/types/evaluator-purchases.types';

const DOT: Record<EvaluatorPurchasePayment['status'], string> = {
  SUCCESS: 'bg-emerald-500',
  PENDING: 'bg-amber-500',
  FAILED: 'bg-destructive',
  CANCELLED: 'bg-muted-foreground',
  REFUNDED: 'bg-slate-400',
};

// Payment attempts, newest first. Amounts cover the whole order, not just the evaluator's lines.
const PaymentTimeline = ({ payments }: { payments: EvaluatorPurchasePayment[] }) => {
  if (payments.length === 0) {
    return (
      <p className='rounded-lg border border-dashed bg-background px-3 py-4 text-sm text-muted-foreground'>
        The customer hasn&apos;t started a payment for this order yet.
      </p>
    );
  }

  return (
    <ol className='relative flex flex-col gap-4 pl-5 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border'>
      {payments.map((p) => (
        <li key={p.id} className='relative'>
          <span
            aria-hidden
            className={cn(
              'absolute top-1.5 -left-5 size-[11px] rounded-full ring-4 ring-background',
              DOT[p.status],
            )}
          />
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <PurchaseStatusBadge status={p.status} />
            <span className='text-sm font-medium tabular-nums'>
              {formatMoney(p.amount, p.currency)}
            </span>
          </div>
          <p className='mt-1 text-xs text-muted-foreground'>
            {p.paidAt ? `Paid ${formatDateTime(p.paidAt)}` : `Started ${formatDateTime(p.createdAt)}`}
            {p.method ? ` · ${p.method}` : ''}
          </p>
          <p className='truncate font-mono text-[11px] text-muted-foreground/80' title={p.transactionId}>
            {p.transactionId}
          </p>
        </li>
      ))}
    </ol>
  );
};

export default PaymentTimeline;
