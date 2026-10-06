'use client';

import { useState } from 'react';
import { Loader2, TriangleAlert, Tags } from 'lucide-react';
import { toast } from 'sonner';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateEvaluatorPurchasePrice } from '@/hooks';
import { getApiErrorMessage, parseFieldErrors } from '@/lib/errors';
import type { EvaluatorPurchaseRow } from '@/types/evaluator-purchases.types';

const SELECT_CLASS =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

const validatePrice = (raw: string) => {
  if (raw.trim() === '') return 'Enter a price.';
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 'Price must be 0 or more.';
  if (!/^\d+(\.\d{1,2})?$/.test(raw.trim())) return 'Use at most 2 decimal places.';
  return undefined;
};

type IProps = {
  order: EvaluatorPurchaseRow;
  size?: 'sm' | 'default';
};

// Line-price override for unpaid orders (PATCH /evaluator/purchases/:id).
const AdjustPriceDialog = ({ order, size = 'default' }: IProps) => {
  const [open, setOpen] = useState(false);
  const [assessmentId, setAssessmentId] = useState(order.assessments[0]?.id ?? '');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string>();
  const update = useUpdateEvaluatorPurchasePrice();

  const line = order.assessments.find((a) => a.id === assessmentId);

  const onOpenChange = (next: boolean) => {
    if (update.isPending) return;
    // Start every session from a clean form prefilled with the line's list price.
    if (next) {
      const first = order.assessments[0];
      setAssessmentId(first?.id ?? '');
      setPrice(first ? String(Number(first.price)) : '');
      setError(undefined);
    }
    setOpen(next);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validatePrice(price);
    if (invalid) return setError(invalid);

    update.mutate(
      { purchaseId: order.id, payload: { assessmentId, price: Number(price) } },
      {
        onSuccess: (res) => {
          toast.success(`Price updated. Your subtotal is now ${formatMoney(res.data.subtotal)}.`);
          setOpen(false);
        },
        onError: (err) => {
          const fieldError = parseFieldErrors(err).price;
          if (fieldError) setError(fieldError);
          else toast.error(getApiErrorMessage(err, 'Could not update the price.'));
        },
      },
    );
  };

  return (
    <>
      <Button variant='outline' size={size} onClick={() => onOpenChange(true)}>
        <Tags /> Adjust price
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <form onSubmit={onSubmit} className='flex flex-col gap-4' noValidate>
            <DialogHeader>
              <DialogTitle>Adjust line price</DialogTitle>
              <DialogDescription>
                Override what this customer pays for one of your assessments, for example a manual
                discount. The order total is recalculated.
              </DialogDescription>
            </DialogHeader>

            {order.assessments.length > 1 && (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='adjust-assessment'>Assessment</Label>
                <select
                  id='adjust-assessment'
                  className={SELECT_CLASS}
                  value={assessmentId}
                  onChange={(e) => {
                    setAssessmentId(e.target.value);
                    const next = order.assessments.find((a) => a.id === e.target.value);
                    if (next) setPrice(String(Number(next.price)));
                    setError(undefined);
                  }}
                >
                  {order.assessments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='adjust-price'>New price (BDT)</Label>
              <Input
                id='adjust-price'
                type='number'
                inputMode='decimal'
                min={0}
                step='0.01'
                autoFocus
                value={price}
                aria-invalid={Boolean(error)}
                aria-describedby='adjust-price-hint'
                onChange={(e) => {
                  setPrice(e.target.value);
                  setError(undefined);
                }}
              />
              <p
                id='adjust-price-hint'
                className={error ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'}
              >
                {error ??
                  (line
                    ? `“${line.title}” currently lists at ${formatMoney(line.price)}.`
                    : 'Set 0 to make it free.')}
              </p>
            </div>

            <dl className='grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3 text-sm'>
              <div>
                <dt className='text-xs text-muted-foreground'>Your current subtotal</dt>
                <dd className='font-medium tabular-nums'>{formatMoney(order.subtotal)}</dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>Current order total</dt>
                <dd className='font-medium tabular-nums'>{formatMoney(order.price)}</dd>
              </div>
            </dl>

            {order.payments.length > 0 && (
              <p className='flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300'>
                <TriangleAlert className='mt-0.5 size-3.5 shrink-0' />
                A payment was already started for this order. The gateway session keeps the old
                amount, so the customer may need to start a new payment.
              </p>
            )}

            <DialogFooter>
              <DialogClose render={<Button variant='outline' disabled={update.isPending} />}>
                Cancel
              </DialogClose>
              <Button type='submit' disabled={update.isPending || !assessmentId}>
                {update.isPending && <Loader2 className='animate-spin' />}
                Update price
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdjustPriceDialog;
