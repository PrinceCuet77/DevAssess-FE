import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DeveloperRecentPurchase } from '@/types/developer-dashboard.types';

// `payments` holds only the latest payment here, so SUCCESS there means paid.
const OrderBadge = ({ payments }: Pick<DeveloperRecentPurchase, 'payments'>) => {
  const status = payments[0]?.status;
  if (status === 'SUCCESS') return <Badge variant='success'>Paid</Badge>;
  if (status === 'PENDING') return <Badge variant='warning'>Payment pending</Badge>;
  if (status === 'FAILED') return <Badge variant='destructive'>Payment failed</Badge>;
  if (status === 'CANCELLED') return <Badge variant='secondary'>Cancelled</Badge>;
  if (status === 'REFUNDED') return <Badge variant='secondary'>Refunded</Badge>;
  return <Badge variant='outline'>Awaiting payment</Badge>;
};

const RecentPurchases = ({ purchases }: { purchases: DeveloperRecentPurchase[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent purchases</CardTitle>
      <CardDescription>Your latest orders.</CardDescription>
    </CardHeader>
    <CardContent>
      {purchases.length === 0 ? (
        <p className='py-6 text-center text-sm text-muted-foreground'>No purchases yet.</p>
      ) : (
        <ul className='flex flex-col divide-y divide-border/60'>
          {purchases.map((purchase) => {
            const status = purchase.payments[0]?.status;
            const payable = status !== 'SUCCESS' && status !== 'REFUNDED';
            return (
              <li key={purchase.id} className='flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
                  <ShoppingBag className='size-4' />
                </div>
                <div className='min-w-0 flex-1'>
                  <Link
                    href={`/developer/purchases/detail?id=${purchase.id}`}
                    className='block truncate text-sm font-medium hover:underline'
                  >
                    {purchase.assessments.map((a) => a.title).join(', ')}
                  </Link>
                  <p className='text-xs text-muted-foreground'>
                    {new Date(purchase.createdAt).toLocaleDateString()} · {formatMoney(purchase.price)}
                  </p>
                </div>
                <OrderBadge payments={purchase.payments} />
                {payable && (
                  <PayOrderButton
                    purchaseId={purchase.id}
                    label={status === 'FAILED' || status === 'CANCELLED' ? 'Retry' : 'Pay now'}
                    size='sm'
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentPurchases;
