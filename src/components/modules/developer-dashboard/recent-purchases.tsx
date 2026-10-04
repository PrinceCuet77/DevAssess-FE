import { ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DeveloperRecentPurchase } from '@/types/developer-dashboard.types';

const OrderBadge = ({ payments }: Pick<DeveloperRecentPurchase, 'payments'>) => {
  const status = payments[0]?.status;
  if (status === 'SUCCESS') return <Badge variant='success'>Paid</Badge>;
  if (status === 'PENDING') return <Badge variant='warning'>Pending</Badge>;
  if (status === 'FAILED' || status === 'CANCELLED') return <Badge variant='destructive'>Failed</Badge>;
  if (status === 'REFUNDED') return <Badge variant='secondary'>Refunded</Badge>;
  return <Badge variant='outline'>Unpaid</Badge>;
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
          {purchases.map((purchase) => (
            <li key={purchase.id} className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
                <ShoppingBag className='size-4' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>
                  {purchase.assessments.map((a) => a.title).join(', ')}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {new Date(purchase.createdAt).toLocaleDateString()} · BDT{' '}
                  {Number(purchase.price).toFixed(2)}
                </p>
              </div>
              <OrderBadge payments={purchase.payments} />
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentPurchases;
