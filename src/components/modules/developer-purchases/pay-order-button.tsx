'use client';

import Link from 'next/link';
import { FetchError } from 'ofetch';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCreatePayment, useGetAllPurchases, useGetOwnedAssessments } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';

type IProps = {
  purchaseId: string;
  label: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
};

// Starts a fresh payment attempt and hands the browser over to the hosted gateway page.
const PayOrderButton = ({ purchaseId, label, size = 'default', className }: IProps) => {
  const { mutate, isPending, isSuccess } = useCreatePayment();
  const purchases = useGetAllPurchases();
  const owned = useGetOwnedAssessments();
  const busy = isPending || isSuccess; // stay disabled while the redirect happens

  // The backend doesn't re-check ownership when paying, and the same assessment can sit in several
  // unpaid orders. Paying an order whose assessment the developer already owns would charge twice.
  const order = purchases.data?.find((p) => p.id === purchaseId);
  const alreadyOwned = order?.payments.some((p) => p.status === 'SUCCESS')
    ? []
    : (order?.assessments.filter((a) => owned.data?.some((o) => o.id === a.id)) ?? []);

  if (alreadyOwned.length > 0) {
    return (
      <p role='status' className='rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 text-xs'>
        You already own {alreadyOwned.map((a) => `“${a.title}”`).join(', ')} from another order, so paying this one would
        charge you twice.{' '}
        <Link href='/assessments' className='font-medium underline'>
          Buy the others separately
        </Link>
        .
      </p>
    );
  }

  return (
    <Button
      size={size}
      className={className}
      disabled={busy}
      onClick={() =>
        mutate(purchaseId, {
          onSuccess: (res) => {
            window.location.href = res.data.gatewayPageURL;
          },
          onError: (err) => {
            if (err instanceof FetchError && err.status === 409) {
              toast.success('This order is already paid. Your assessments are unlocked.');
              return;
            }
            toast.error(getApiErrorMessage(err, 'Could not start the payment.'));
          },
        })
      }
    >
      {busy ? <Loader2 className='animate-spin' /> : <CreditCard />}
      {busy ? 'Redirecting…' : label}
    </Button>
  );
};

export default PayOrderButton;
