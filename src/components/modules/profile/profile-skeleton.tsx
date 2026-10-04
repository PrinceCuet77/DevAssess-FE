import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton = () => (
  <div className='flex flex-col gap-6' aria-busy='true' aria-label='Loading profile'>
    <Card>
      <CardHeader>
        <Skeleton className='h-5 w-32' />
      </CardHeader>
      <CardContent className='flex items-center gap-4'>
        <Skeleton className='size-24 rounded-full' />
        <Skeleton className='h-8 w-36' />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className='h-5 w-40' />
      </CardHeader>
      <CardContent className='grid gap-5 sm:grid-cols-2'>
        <Skeleton className='h-11 sm:col-span-2' />
        <Skeleton className='h-11' />
        <Skeleton className='h-11' />
        <Skeleton className='h-11' />
        <Skeleton className='h-28 sm:col-span-2' />
      </CardContent>
    </Card>
  </div>
);

export default ProfileSkeleton;
