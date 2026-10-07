'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import CheckoutLine from '@/components/modules/developer-checkout/checkout-line';
import LineNotice from '@/components/modules/developer-checkout/line-notice';
import OrderSummaryCard from '@/components/modules/developer-checkout/order-summary-card';
import { useCheckout } from '@/components/modules/developer-checkout/use-checkout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart, useGetOwnedAssessments, useGetPendingOrders } from '@/hooks';

const CartView = () => {
  const cart = useCart();
  const owned = useGetOwnedAssessments();
  const pending = useGetPendingOrders();
  const checkout = useCheckout({
    // Only now is it safe to empty the cart: the order exists even if payment fails to start.
    onOrderCreated: (order) => cart.remove(order.assessments.map((a) => a.id)),
    onStaleItems: (ids) => cart.remove(ids),
  });

  if (owned.isPending) {
    return (
      <div className='grid gap-6 lg:grid-cols-[1fr_22rem]'>
        <Skeleton className='h-64 rounded-xl' />
        <Skeleton className='h-64 rounded-xl' />
      </div>
    );
  }

  if (cart.count === 0 && !checkout.repriced) {
    return (
      <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center'>
        <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
          <ShoppingCart className='size-6' />
        </div>
        <div className='flex flex-col gap-1'>
          <h3 className='text-base font-semibold'>Your cart is empty</h3>
          <p className='max-w-sm text-sm text-muted-foreground'>
            Add assessments from the catalog and check out several at once with a single payment.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href='/assessments' />}>
          Browse assessments
        </Button>
      </div>
    );
  }

  const ownedIds = new Set(owned.data?.map((a) => a.id));
  const payable = cart.items.filter((item) => !ownedIds.has(item.id));
  const total = payable.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className='grid items-start gap-6 lg:grid-cols-[1fr_22rem]'>
      <Card>
        <CardHeader className='flex flex-row items-start justify-between gap-3'>
          <div>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              Prices are confirmed when your order is created.
            </CardDescription>
          </div>
          {cart.count > 0 && (
            <Button
              variant='ghost'
              size='sm'
              disabled={checkout.busy}
              onClick={() => {
                cart.clear();
                toast.success('Cart cleared.');
              }}
            >
              Clear cart
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {cart.count === 0 ? (
            <p className='py-6 text-center text-sm text-muted-foreground'>Your items moved into the order. Finish paying on the right.</p>
          ) : (
            <ul className='flex flex-col divide-y divide-border/60'>
              {cart.items.map((item) => (
                <CheckoutLine
                  key={item.id}
                  item={item}
                  muted={ownedIds.has(item.id)}
                  disabled={checkout.busy}
                  onRemove={() => cart.remove(item.id)}
                  notice={<LineNotice owned={ownedIds.has(item.id)} pendingOrder={pending.data?.[item.id]} />}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <OrderSummaryCard
        count={checkout.repriced?.assessments.length ?? payable.length}
        total={total}
        stage={checkout.stage}
        repriced={checkout.repriced}
        onCheckout={() => checkout.placeOrder(payable)}
      />
    </div>
  );
};

export default CartView;
