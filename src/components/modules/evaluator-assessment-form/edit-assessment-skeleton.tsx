import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the form layout so the page doesn't jump once the assessment loads.
const EditAssessmentSkeleton = () => (
  <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]' aria-busy='true' aria-label='Loading assessment'>
    <div className='flex flex-col gap-6'>
      <Card>
        <CardHeader className='gap-2'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-4 w-56' />
        </CardHeader>
        <CardContent className='grid gap-5 sm:grid-cols-3'>
          <Skeleton className='h-11 sm:col-span-3' />
          <Skeleton className='h-24 sm:col-span-3' />
          <Skeleton className='h-11 sm:col-span-3' />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-11' />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='gap-2'>
          <Skeleton className='h-5 w-28' />
        </CardHeader>
        <CardContent>
          <Skeleton className='aspect-video w-full max-w-md' />
        </CardContent>
      </Card>
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className='h-64 w-full rounded-xl' />
      ))}
    </div>
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-60 w-full rounded-xl' />
      <Skeleton className='h-11 w-full' />
      <Skeleton className='h-11 w-full' />
    </div>
  </div>
);

export default EditAssessmentSkeleton;
