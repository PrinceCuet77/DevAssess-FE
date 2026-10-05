import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ListSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className='h-5 w-36' />
    </CardHeader>
    <CardContent className='flex flex-col gap-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className='h-10 w-full' />
      ))}
    </CardContent>
  </Card>
);

const DashboardSkeleton = () => (
  <div className='flex flex-col gap-6' aria-busy='true' aria-label='Loading dashboard'>
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className='h-24 rounded-xl' />
      ))}
    </div>
    <div className='grid gap-6 lg:grid-cols-2'>
      <ListSkeleton />
      <ListSkeleton />
    </div>
    <div className='grid gap-6 lg:grid-cols-2'>
      <ListSkeleton />
      <ListSkeleton />
    </div>
    <ListSkeleton />
  </div>
);

export default DashboardSkeleton;
