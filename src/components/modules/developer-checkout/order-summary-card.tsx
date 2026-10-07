import Link from 'next/link';
import { AlertTriangle, CreditCard, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DeveloperPurchase } from '@/types/developer-assessments.types';

type IProps = {
  count: number;
  total: number;
  stage: 'idle' | 'creating' | 'redirecting';
  disabled?: boolean;
  repriced: DeveloperPurchase | null;
  onCheckout: () => void;
};

const OrderSummaryCard = ({ count, total, stage, disabled, repriced, onCheckout }: IProps) => (
  <Card className='lg:sticky lg:top-24'>
    <CardHeader>
      <CardTitle>Order summary</CardTitle>
    </CardHeader>
    <CardContent className='flex flex-col gap-4'>
      <dl className='flex flex-col gap-2 text-sm'>
        <div className='flex justify-between'>
          <dt className='text-muted-foreground'>
            {count} {count === 1 ? 'assessment' : 'assessments'}
          </dt>
          <dd className='tabular-nums'>{formatMoney(total)}</dd>
        </div>
        <div className='flex justify-between border-t border-border/60 pt-2 text-base font-semibold'>
          <dt>Total</dt>
          <dd className='tabular-nums'>{formatMoney(repriced ? repriced.price : total)}</dd>
        </div>
      </dl>

      {repriced ? (
        // The server prices orders from current prices; never send someone to the gateway with a
        // total they haven't seen.
        <div className='flex flex-col gap-3'>
          <p role='alert' className='flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm'>
            <AlertTriangle className='mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400' aria-hidden />
            Prices changed since you added these. Your order total is now {formatMoney(repriced.price)}.
          </p>
          <PayOrderButton purchaseId={repriced.id} label={`Pay ${formatMoney(repriced.price)}`} />
          <Button variant='outline' nativeButton={false} render={<Link href={`/developer/purchases/detail?id=${repriced.id}`} />}>
            Review the order
          </Button>
        </div>
      ) : (
        <Button size='lg' className='h-11 w-full text-base' disabled={disabled || stage !== 'idle' || count === 0} onClick={onCheckout}>
          {stage === 'idle' ? <CreditCard /> : <Loader2 className='animate-spin' />}
          {stage === 'creating' ? 'Creating order…' : stage === 'redirecting' ? 'Redirecting to payment…' : `Pay ${formatMoney(total)}`}
        </Button>
      )}

      <ul className='flex flex-col gap-2 text-xs text-muted-foreground'>
        <li className='flex items-center gap-2'>
          <LockKeyhole className='size-3.5 shrink-0' aria-hidden /> You&apos;ll finish payment on the secure SSLCommerz page.
        </li>
        <li className='flex items-center gap-2'>
          <ShieldCheck className='size-3.5 shrink-0' aria-hidden /> Unpaid orders stay in Purchases so you can pay later.
        </li>
      </ul>
    </CardContent>
  </Card>
);

export default OrderSummaryCard;
