'use client';

import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCreatePayment } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';

type IProps = {
  purchaseId: string;
  label: string;
  size?: 'default' | 'sm';
};

// Starts a fresh payment attempt and hands the browser over to the hosted gateway page.
const PayOrderButton = ({ purchaseId, label, size = 'default' }: IProps) => {
  const { mutate, isPending, isSuccess } = useCreatePayment();
  const busy = isPending || isSuccess; // stay disabled while the redirect happens

  return (
    <Button
      size={size}
      disabled={busy}
      onClick={() =>
        mutate(purchaseId, {
          onSuccess: (res) => {
            window.location.href = res.data.gatewayPageURL;
          },
          onError: (err) => toast.error(getApiErrorMessage(err, 'Could not start the payment.')),
        })
      }
    >
      {busy ? <Loader2 className='animate-spin' /> : <CreditCard />}
      {busy ? 'Redirecting…' : label}
    </Button>
  );
};

export default PayOrderButton;
