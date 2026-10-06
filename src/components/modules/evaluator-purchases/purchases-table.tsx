'use client';

import { Fragment, useState } from 'react';
import { ArrowUpRight, ChevronRight, UserRound } from 'lucide-react';
import Link from 'next/link';
import UserAvatar from '@/components/modules/admin-users/user-avatar';
import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import {
  deriveOrderStatus,
  formatDateTime,
  formatMoney,
  shortId,
} from '@/components/modules/admin-purchases/purchase-utils';
import AdjustPriceDialog from '@/components/modules/evaluator-purchases/adjust-price-dialog';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import PaymentTimeline from '@/components/modules/evaluator-purchases/payment-timeline';
import PurchaseLineItems from '@/components/modules/evaluator-purchases/purchase-line-items';
import { canAdjustPrice, customerName } from '@/components/modules/evaluator-purchases/purchase-utils';
import { Button } from '@/components/ui/button';
import {
  CellStack,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
} from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import type { EvaluatorPurchaseRow } from '@/types/evaluator-purchases.types';

const COLUMNS = 7;

export const detailHref = (id: string) => `/evaluator/purchases/detail?id=${id}`;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
    {children}
  </h4>
);

// Expanded row: what was bought, the payment attempts, and the quick actions.
const ExpandedOrder = ({ order }: { order: EvaluatorPurchaseRow }) => (
  <div className='flex flex-col gap-5 pt-3'>
    <div className='grid gap-6 lg:grid-cols-2'>
      <section>
        <SectionTitle>Your assessments in this order</SectionTitle>
        <PurchaseLineItems order={order} />
      </section>
      <section>
        <SectionTitle>Payment attempts</SectionTitle>
        <PaymentTimeline payments={order.payments} />
      </section>
    </div>
    <div className='flex flex-wrap items-center gap-2'>
      <Button size='sm' nativeButton={false} render={<Link href={detailHref(order.id)} />}>
        View order <ArrowUpRight />
      </Button>
      <Button
        size='sm'
        variant='ghost'
        nativeButton={false}
        render={<Link href={`/evaluator/purchases?customerId=${order.customer.id}`} />}
      >
        <UserRound /> All orders from this customer
      </Button>
      {canAdjustPrice(order) && <AdjustPriceDialog order={order} size='sm' />}
    </div>
  </div>
);

const AssessmentsCell = ({ order }: { order: EvaluatorPurchaseRow }) => {
  const [first, ...rest] = order.assessments;
  if (!first) return <span className='text-muted-foreground'>N/A</span>;
  return (
    <div className='flex max-w-xs items-center gap-3'>
      <AssessmentThumbnail src={first.thumbnailUrl} />
      <CellStack
        primary={<span title={order.assessments.map((a) => a.title).join(', ')}>{first.title}</span>}
        secondary={rest.length > 0 ? `+${rest.length} more of yours` : undefined}
      />
    </div>
  );
};

const EarningsCell = ({ order, paid }: { order: EvaluatorPurchaseRow; paid: boolean }) => {
  const sharedOrder = Number(order.price) !== Number(order.subtotal);
  return (
    <div className='text-right'>
      <p className={cn('font-semibold tabular-nums', !paid && 'text-muted-foreground')}>
        {formatMoney(order.subtotal)}
      </p>
      <p className='text-xs text-muted-foreground tabular-nums'>
        {paid ? (sharedOrder ? `of ${formatMoney(order.price)}` : 'Earned') : 'Not earned yet'}
      </p>
    </div>
  );
};

const PurchasesTable = ({ purchases }: { purchases: EvaluatorPurchaseRow[] }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <DataTable minWidth={980}>
      <DataTableHead>
        <tr>
          <DataTableHeadCell className='w-10'>
            <span className='sr-only'>Expand</span>
          </DataTableHeadCell>
          <DataTableHeadCell>Order</DataTableHeadCell>
          <DataTableHeadCell>Customer</DataTableHeadCell>
          <DataTableHeadCell>My assessments</DataTableHeadCell>
          <DataTableHeadCell className='text-right'>My earnings</DataTableHeadCell>
          <DataTableHeadCell>Status</DataTableHeadCell>
          <DataTableHeadCell>Method</DataTableHeadCell>
        </tr>
      </DataTableHead>
      <DataTableBody>
        {purchases.map((order) => {
          const status = deriveOrderStatus(order.payments);
          const paidPayment = order.payments.find((p) => p.status === 'SUCCESS');
          const open = expanded.has(order.id);
          const { customer } = order;
          const caption = [customer.profession, customer.company].filter(Boolean).join(' · ');
          return (
            <Fragment key={order.id}>
              <DataTableRow className={cn(open && 'bg-muted/30')}>
                <DataTableCell className='pr-0'>
                  <button
                    type='button'
                    onClick={() => toggle(order.id)}
                    aria-expanded={open}
                    aria-label={`${open ? 'Hide' : 'Show'} details for order ${shortId(order.id)}`}
                    className='flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
                  >
                    <ChevronRight className={cn('size-4 transition-transform', open && 'rotate-90')} />
                  </button>
                </DataTableCell>
                <DataTableCell>
                  <Link href={detailHref(order.id)} className='block hover:underline'>
                    <CellStack
                      primary={<span className='font-mono text-xs'>#{shortId(order.id)}</span>}
                      secondary={formatDateTime(order.createdAt)}
                    />
                  </Link>
                </DataTableCell>
                <DataTableCell>
                  <div className='flex max-w-56 items-center gap-3'>
                    <UserAvatar
                      name={customer.name}
                      email={customer.email}
                      avatarUrl={customer.avatarUrl}
                      className='size-8'
                    />
                    <CellStack
                      primary={customerName(customer)}
                      secondary={caption || (customer.name ? customer.email : undefined)}
                    />
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <AssessmentsCell order={order} />
                </DataTableCell>
                <DataTableCell className='whitespace-nowrap'>
                  <EarningsCell order={order} paid={status === 'SUCCESS'} />
                </DataTableCell>
                <DataTableCell>
                  <PurchaseStatusBadge status={status} />
                  {order.payments.length > 1 && (
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {order.payments.length} attempts
                    </p>
                  )}
                </DataTableCell>
                <DataTableCell className='whitespace-nowrap text-muted-foreground'>
                  {paidPayment?.method ?? 'N/A'}
                </DataTableCell>
              </DataTableRow>
              {open && (
                <tr className='bg-muted/20'>
                  <td colSpan={COLUMNS} className='px-4 pt-1 pb-5 sm:pl-14'>
                    <ExpandedOrder order={order} />
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </DataTableBody>
    </DataTable>
  );
};

export default PurchasesTable;
