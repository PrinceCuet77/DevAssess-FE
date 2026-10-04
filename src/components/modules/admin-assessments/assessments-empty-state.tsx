import { FileQuestion, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminAssessmentsQuery } from '@/types/admin-assessments.types';

type IProps = {
  query: AdminAssessmentsQuery;
  onChange: (patch: Partial<AdminAssessmentsQuery>) => void;
};

const AssessmentsEmptyState = ({ query, onChange }: IProps) => {
  const hasFilters = Boolean(query.search || query.status || query.tags || query.creatorId);
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
            : 'Assessments will appear here once evaluators create them.'}
        </p>
      </div>
      {hasFilters && (
        <Button
          variant='outline'
          onClick={() =>
            onChange({
              search: undefined,
              status: undefined,
              tags: undefined,
              creatorId: undefined,
            })
          }
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default AssessmentsEmptyState;
