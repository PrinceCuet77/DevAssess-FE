import Link from 'next/link';
import { CreditCard, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IProps = {
  filtered: boolean;
  onClear: () => void;
};

const PaymentsEmptyState = ({ filtered, onClear }: IProps) => {
  const Icon = filtered ? SearchX : CreditCard;

  return (
    <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>{filtered ? 'No payments found' : 'No payments yet'}</h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {filtered
            ? 'No payments match this status. Try another one.'
            : 'Every payment attempt you make at checkout will be listed here.'}
        </p>
      </div>
      {filtered ? (
        <Button variant='outline' onClick={onClear}>
          Clear filters
        </Button>
      ) : (
        <Button variant='outline' nativeButton={false} render={<Link href='/developer/purchases' />}>
          View my purchases
        </Button>
      )}
    </div>
  );
};

export default PaymentsEmptyState;
