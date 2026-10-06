import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import { formatDateTime, formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import type { DeveloperPayment } from '@/types/developer-assessments.types';

export const paymentTitle = (payment: DeveloperPayment) => {
  const [first, ...rest] = payment.purchase.assessments;
  if (!first) return 'Assessment order';
  return rest.length > 0 ? `${first.title} +${rest.length} more` : first.title;
};

export const canRetry = (status: DeveloperPayment['status']) =>
  status === 'FAILED' || status === 'CANCELLED' || status === 'PENDING';

const PaymentRow = ({ payment }: { payment: DeveloperPayment }) => {
  const href = `/developer/payments/detail?id=${payment.id}`;
  const date = payment.paidAt ?? payment.createdAt;

  return (
    <li className='flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 transition-colors hover:bg-muted/30'>
      <AssessmentThumbnail src={payment.purchase.assessments[0]?.thumbnailUrl ?? null} className='size-11' />
      <div className='min-w-0 flex-1 basis-56'>
        <Link
          href={href}
          className='block truncate rounded text-sm font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50'
          title={paymentTitle(payment)}
        >
          {paymentTitle(payment)}
        </Link>
        <p className='mt-0.5 truncate font-mono text-[11px] text-muted-foreground' title={payment.transactionId}>
          {payment.transactionId}
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {payment.paidAt ? 'Paid' : 'Started'} {formatDateTime(date)}
          {payment.method ? ` · ${payment.method}` : ''}
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <PurchaseStatusBadge status={payment.status} />
        <span className='w-28 text-right text-sm font-semibold tabular-nums'>
          {formatMoney(payment.amount, payment.currency)}
        </span>
      </div>
      <div className='flex w-full items-center justify-end gap-2 sm:w-auto'>
        {canRetry(payment.status) && (
          <PayOrderButton purchaseId={payment.purchase.id} label='Try again' size='sm' />
        )}
        <Link
          href={href}
          aria-label={`View payment ${payment.transactionId}`}
          className='flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
        >
          <ChevronRight className='size-4' />
        </Link>
      </div>
    </li>
  );
};

export default PaymentRow;
