'use client';

import { Fragment, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import PurchaseStatusBadge from '@/components/modules/admin-purchases/purchase-status-badge';
import {
  deriveOrderStatus,
  formatDateTime,
  formatMoney,
  shortId,
} from '@/components/modules/admin-purchases/purchase-utils';
import PurchaseDetails from '@/components/modules/admin-purchases/purchase-details';
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
import type { AdminPurchaseRow } from '@/types/admin-purchases.types';

const MAX_TITLES = 2;

const PurchasesTable = ({ purchases }: { purchases: AdminPurchaseRow[] }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <DataTable minWidth={960}>
      <DataTableHead>
        <tr>
          <DataTableHeadCell className='w-10'>
            <span className='sr-only'>Expand</span>
          </DataTableHeadCell>
          <DataTableHeadCell>Order</DataTableHeadCell>
          <DataTableHeadCell>Customer</DataTableHeadCell>
          <DataTableHeadCell>Assessments</DataTableHeadCell>
          <DataTableHeadCell className='text-right'>Total</DataTableHeadCell>
          <DataTableHeadCell>Status</DataTableHeadCell>
          <DataTableHeadCell>Method</DataTableHeadCell>
        </tr>
      </DataTableHead>
      <DataTableBody>
        {purchases.map((order) => {
          const status = deriveOrderStatus(order.payments);
          const paid = order.payments.find((p) => p.status === 'SUCCESS');
          const open = expanded.has(order.id);
          const titles = order.assessments.map((a) => a.title);
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
                    <ChevronRight
                      className={cn('size-4 transition-transform', open && 'rotate-90')}
                    />
                  </button>
                </DataTableCell>
                <DataTableCell>
                  <CellStack
                    primary={<span className='font-mono text-xs'>#{shortId(order.id)}</span>}
                    secondary={formatDateTime(order.createdAt)}
                  />
                </DataTableCell>
                <DataTableCell>
                  <Link
                    href={`/admin/users/detail?id=${order.customer.id}`}
                    className='block max-w-48 hover:underline'
                  >
                    <CellStack
                      primary={order.customer.name ?? order.customer.email}
                      secondary={order.customer.name ? order.customer.email : undefined}
                    />
                  </Link>
                </DataTableCell>
                <DataTableCell>
                  <div className='max-w-xs'>
                    <p className='truncate font-medium' title={titles.join(', ')}>
                      {titles.slice(0, MAX_TITLES).join(', ')}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {titles.length > MAX_TITLES
                        ? `+${titles.length - MAX_TITLES} more · `
                        : ''}
                      {titles.length} {titles.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </DataTableCell>
                <DataTableCell className='text-right font-medium whitespace-nowrap tabular-nums'>
                  {formatMoney(order.price)}
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
                  {paid?.method ?? 'N/A'}
                </DataTableCell>
              </DataTableRow>
              {open && (
                <tr className='bg-muted/20'>
                  <td colSpan={7} className='px-4 pt-1 pb-5 sm:pl-14'>
                    <PurchaseDetails order={order} />
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
