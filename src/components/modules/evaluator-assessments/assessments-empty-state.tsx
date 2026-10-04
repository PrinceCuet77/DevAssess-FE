import { FileQuestion, Plus, SearchX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { EvaluatorAssessmentsQuery } from '@/types/evaluator-assessments.types';

type IProps = {
  query: EvaluatorAssessmentsQuery;
  onChange: (patch: Partial<EvaluatorAssessmentsQuery>) => void;
};

const AssessmentsEmptyState = ({ query, onChange }: IProps) => {
  const hasFilters = Boolean(
    query.search ||
      query.status ||
      query.duration !== undefined ||
      query.minPrice !== undefined ||
      query.maxPrice !== undefined,
  );
  const Icon = hasFilters ? SearchX : FileQuestion;

  return (
    <div className='flex flex-col items-center gap-3 px-4 py-12 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>
          {hasFilters ? 'No assessments found' : 'No assessments yet'}
        </h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {hasFilters
            ? 'Nothing matches your current filters. Try removing one, or check the spelling of your search.'
            : 'Create your first assessment, save it as a draft, and publish it when you are ready to sell.'}
        </p>
      </div>
      {hasFilters ? (
        <Button
          variant='outline'
          onClick={() =>
            onChange({
              search: undefined,
              status: undefined,
              duration: undefined,
              minPrice: undefined,
              maxPrice: undefined,
            })
          }
        >
          Clear all filters
        </Button>
      ) : (
        <Button render={<Link href='/evaluator/assessments/new' />}>
          <Plus />
          Create your first assessment
        </Button>
      )}
    </div>
  );
};

export default AssessmentsEmptyState;
