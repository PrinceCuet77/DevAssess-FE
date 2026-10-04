import { ReceiptText, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminPurchasesQuery } from '@/types/admin-purchases.types';

type IProps = {
  query: AdminPurchasesQuery;
  onChange: (patch: Partial<AdminPurchasesQuery>) => void;
};

const PurchasesEmptyState = ({ query, onChange }: IProps) => {
  const hasFilters = Boolean(
    query.search || query.paymentStatus || query.customerId || query.assessmentId,
  );
  const Icon = hasFilters ? SearchX : ReceiptText;

  return (
    <div className='flex flex-col items-center gap-3 px-4 py-12 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>
          {hasFilters ? 'No orders found' : 'No orders yet'}
        </h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {hasFilters
            ? 'Nothing matches your current filters. Try removing one, or check the spelling of your search.'
            : 'Orders will appear here once developers start buying assessments.'}
        </p>
      </div>
      {hasFilters && (
        <Button
          variant='outline'
          onClick={() =>
            onChange({
              search: undefined,
              paymentStatus: undefined,
              customerId: undefined,
              assessmentId: undefined,
            })
          }
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default PurchasesEmptyState;
