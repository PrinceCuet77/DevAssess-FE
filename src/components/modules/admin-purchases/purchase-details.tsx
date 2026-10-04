import Link from 'next/link';
import AssessmentStatusBadge from '@/components/modules/admin-assessments/assessment-status-badge';
import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import { formatDateTime, formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import type { AdminPurchaseRow } from '@/types/admin-purchases.types';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
    {children}
  </h4>
);

// Expanded row content: what was bought, from whom, and every payment attempt.
const PurchaseDetails = ({ order }: { order: AdminPurchaseRow }) => (
  <div className='grid gap-6 pt-3 lg:grid-cols-2'>
    <section>
      <SectionTitle>Assessments in this order</SectionTitle>
      <ul className='flex flex-col divide-y divide-border/60 rounded-lg border bg-background'>
        {order.assessments.map((a) => (
          <li key={a.id} className='flex items-center justify-between gap-3 px-3 py-2.5'>
            <div className='min-w-0'>
              <Link
                href={`/admin/assessments/detail?id=${a.id}`}
                className='block truncate text-sm font-medium hover:underline'
              >
                {a.title}
              </Link>
              <p className='truncate text-xs text-muted-foreground'>
                by{' '}
                <Link href={`/admin/users/detail?id=${a.creator.id}`} className='hover:underline'>
                  {a.creator.name ?? a.creator.email}
                </Link>
              </p>
            </div>
            <div className='flex shrink-0 flex-col items-end gap-1'>
              <span className='text-sm tabular-nums'>{formatMoney(a.price)}</span>
              <AssessmentStatusBadge status={a.status} />
            </div>
          </li>
        ))}
      </ul>
      <p className='mt-2 text-xs text-muted-foreground'>
        Line prices show each assessment&apos;s current price. The order total is what was charged.
      </p>
    </section>
    <section>
      <SectionTitle>Payment attempts</SectionTitle>
      {order.payments.length === 0 ? (
        <p className='rounded-lg border border-dashed bg-background px-3 py-4 text-sm text-muted-foreground'>
          No payment was started for this order.
        </p>
      ) : (
        <ol className='flex flex-col divide-y divide-border/60 rounded-lg border bg-background'>
          {order.payments.map((p) => (
            <li key={p.id} className='flex flex-col gap-1 px-3 py-2.5'>
              <div className='flex items-center justify-between gap-3'>
                <PurchaseStatusBadge status={p.status} />
                <span className='text-sm font-medium tabular-nums'>
                  {formatMoney(p.amount, p.currency)}
                </span>
              </div>
              <p className='truncate font-mono text-xs text-muted-foreground' title={p.transactionId}>
                {p.transactionId}
              </p>
              <p className='text-xs text-muted-foreground'>
                {p.paidAt ? `Paid ${formatDateTime(p.paidAt)}` : `Started ${formatDateTime(p.createdAt)}`}
                {p.method ? ` · ${p.method}` : ''}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  </div>
);

export default PurchaseDetails;
