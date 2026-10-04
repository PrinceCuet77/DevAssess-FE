import { PlayCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PendingBanner = ({ count }: { count: number }) => {
  if (count === 0) return null;

  return (
    <Card className='bg-primary/5 ring-primary/20'>
      <CardContent className='flex items-center gap-3'>
        <PlayCircle className='size-5 shrink-0 text-primary' />
        <p className='text-sm'>
          You have <span className='font-semibold'>{count}</span> purchased{' '}
          {count === 1 ? 'assessment' : 'assessments'} waiting to be attempted.
        </p>
      </CardContent>
    </Card>
  );
};

export default PendingBanner;
