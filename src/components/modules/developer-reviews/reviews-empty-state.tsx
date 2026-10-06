import Link from 'next/link';
import { SearchX, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IProps = {
  filtered: boolean;
  onClear: () => void;
};

const ReviewsEmptyState = ({ filtered, onClear }: IProps) => {
  const Icon = filtered ? SearchX : Star;

  return (
    <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold'>{filtered ? 'No reviews found' : 'No reviews yet'}</h3>
        <p className='max-w-sm text-sm text-muted-foreground'>
          {filtered
            ? 'No reviews match your search. Try different keywords or clear the filters.'
            : 'Finish an assessment attempt and share your experience to help other developers.'}
        </p>
      </div>
      {filtered ? (
        <Button variant='outline' onClick={onClear}>
          Clear filters
        </Button>
      ) : (
        <Button variant='outline' nativeButton={false} render={<Link href='/developer/my-assessments' />}>
          Go to my assessments
        </Button>
      )}
    </div>
  );
};

export default ReviewsEmptyState;
