import { ReceiptText, SearchX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { EvaluatorPurchasesQuery } from '@/types/evaluator-purchases.types';

type IProps = {
  query: EvaluatorPurchasesQuery;
  onChange: (patch: Partial<EvaluatorPurchasesQuery>) => void;
};

export const hasActiveFilters = (query: EvaluatorPurchasesQuery) =>
  Boolean(query.search || query.paymentStatus || query.customerId || query.assessmentId);

const PurchasesEmptyState = ({ query, onChange }: IProps) => {
  const filtered = hasActiveFilters(query);
  const Icon = filtered ? SearchX : ReceiptText;

  return (
    <div className='flex flex-col items-center gap-3 px-4 py-12 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>{filtered ? 'No sales found' : 'No sales yet'}</h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {filtered
            ? 'Nothing matches your current filters. Try removing one, or check the spelling of your search.'
            : 'Orders appear here as soon as a developer checks out one of your published assessments.'}
        </p>
      </div>
      {filtered ? (
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
      ) : (
        <Button variant='outline' nativeButton={false} render={<Link href='/evaluator/assessments' />}>
          Manage assessments
        </Button>
      )}
    </div>
  );
};

export default PurchasesEmptyState;
