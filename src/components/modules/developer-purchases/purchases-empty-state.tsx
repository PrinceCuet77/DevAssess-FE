import Link from 'next/link';
import { SearchX, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IProps = {
  filtered: boolean;
  onClear: () => void;
};

const PurchasesEmptyState = ({ filtered, onClear }: IProps) => {
  const Icon = filtered ? SearchX : ShoppingBag;

  return (
    <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>{filtered ? 'No orders found' : 'No purchases yet'}</h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {filtered
            ? 'Nothing matches your filters. Try another status or a different keyword.'
            : 'Your orders and their payment status will appear here after you check out an assessment.'}
        </p>
      </div>
      {filtered ? (
        <Button variant='outline' onClick={onClear}>
          Clear filters
        </Button>
      ) : (
        <Button nativeButton={false} render={<Link href='/' />}>
          Browse assessments
        </Button>
      )}
    </div>
  );
};

export default PurchasesEmptyState;
