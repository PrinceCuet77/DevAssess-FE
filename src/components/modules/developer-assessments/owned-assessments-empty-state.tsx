import Link from 'next/link';
import { BookOpenCheck, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IProps = {
  filtered: boolean;
  onClear: () => void;
};

const OwnedAssessmentsEmptyState = ({ filtered, onClear }: IProps) => {
  const Icon = filtered ? SearchX : BookOpenCheck;

  return (
    <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>
          {filtered ? 'No assessments found' : 'No assessments yet'}
        </h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {filtered
            ? 'Nothing matches your search. Try a different keyword.'
            : 'Assessments you buy will show up here once payment completes, ready for you to take.'}
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

export default OwnedAssessmentsEmptyState;
