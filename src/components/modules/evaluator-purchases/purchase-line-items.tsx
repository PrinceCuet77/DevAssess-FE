import Link from 'next/link';
import AssessmentStatusBadge from '@/components/modules/admin-assessments/assessment-status-badge';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import type { EvaluatorPurchaseRow } from '@/types/evaluator-purchases.types';

// The evaluator's own lines in an order. Other evaluators' items are never returned.
const PurchaseLineItems = ({ order }: { order: EvaluatorPurchaseRow }) => (
  <div className='flex flex-col gap-2'>
    <ul className='flex flex-col divide-y divide-border/60 rounded-lg border bg-background'>
      {order.assessments.map((a) => (
        <li key={a.id} className='flex items-center gap-3 px-3 py-2.5'>
          <AssessmentThumbnail src={a.thumbnailUrl} />
          <div className='min-w-0 flex-1'>
            <Link
              href={`/evaluator/assessments/detail?id=${a.id}`}
              className='block truncate text-sm font-medium hover:underline'
            >
              {a.title}
            </Link>
            <div className='mt-1'>
              <AssessmentStatusBadge status={a.status} />
            </div>
          </div>
          <div className='shrink-0 text-right'>
            <p className='text-sm tabular-nums'>{formatMoney(a.price)}</p>
            <p className='text-[11px] text-muted-foreground'>list price</p>
          </div>
        </li>
      ))}
    </ul>
    <p className='text-xs text-muted-foreground'>
      List prices are current, not what was paid. Your earnings on this order are the subtotal.
    </p>
  </div>
);

export default PurchaseLineItems;
