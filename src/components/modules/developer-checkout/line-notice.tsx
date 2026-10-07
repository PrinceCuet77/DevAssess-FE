import Link from 'next/link';
import { formatDateTime, shortId } from '@/components/modules/admin-purchases/purchase-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import { cn } from '@/lib/utils';
import type { PendingOrder } from '@/types/developer-assessments.types';

type IProps = { owned: boolean; pendingOrder?: PendingOrder };

// Per-line warnings at checkout: already owned (excluded from the order), or already sitting in an
// unpaid order, where paying that order beats creating a second one for the same assessment.
const LineNotice = ({ owned, pendingOrder }: IProps) => {
  if (!owned && !pendingOrder) return null;

  return (
    <div
      role='status'
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-3 text-sm sm:flex-row sm:items-center',
        owned ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5',
      )}
    >
      {owned ? (
        <p className='flex-1'>You already own this, so it won&apos;t be included in the order.</p>
      ) : (
        <>
          <p className='flex-1'>
            It&apos;s already in an unpaid order{' '}
            <Link href={`/developer/purchases/detail?id=${pendingOrder!.purchaseId}`} className='font-mono text-xs underline'>
              #{shortId(pendingOrder!.purchaseId)}
            </Link>{' '}
            from {formatDateTime(pendingOrder!.createdAt)}. Pay that order instead to avoid a duplicate.
          </p>
          <PayOrderButton purchaseId={pendingOrder!.purchaseId} label='Pay that order' size='sm' />
        </>
      )}
    </div>
  );
};

export default LineNotice;
