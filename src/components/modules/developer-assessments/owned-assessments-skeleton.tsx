import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const OwnedAssessmentsSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
    {Array.from({ length: count }, (_, i) => (
      <Card key={i} className='gap-0 overflow-hidden py-0'>
        <Skeleton className='aspect-video w-full rounded-none' />
        <CardContent className='flex flex-col gap-3 p-4'>
          <Skeleton className='h-5 w-3/4' />
          <Skeleton className='h-3 w-1/3' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-8 w-full' />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default OwnedAssessmentsSkeleton;
