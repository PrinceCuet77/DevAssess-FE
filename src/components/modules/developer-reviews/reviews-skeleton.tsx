import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ReviewsSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3' aria-busy>
    {Array.from({ length: count }, (_, i) => (
      <Card key={i} className='gap-4 p-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-12 rounded-lg' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-3 w-1/4' />
          </div>
        </div>
        <Skeleton className='h-4 w-28' />
        <div className='space-y-2'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-4/5' />
        </div>
      </Card>
    ))}
  </div>
);

export default ReviewsSkeleton;
