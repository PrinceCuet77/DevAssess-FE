import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PurchasesSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className='flex flex-col gap-4' aria-busy>
    {Array.from({ length: count }, (_, i) => (
      <Card key={i} className='gap-0 overflow-hidden py-0'>
        <div className='flex items-center justify-between border-b bg-muted/30 px-4 py-3'>
          <div className='space-y-2'>
            <Skeleton className='h-3.5 w-28' />
            <Skeleton className='h-3 w-36' />
          </div>
          <Skeleton className='h-6 w-24' />
        </div>
        <div className='flex items-center gap-3 px-4 py-3'>
          <Skeleton className='size-12 rounded-lg' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-3 w-1/3' />
          </div>
          <Skeleton className='h-4 w-16' />
        </div>
        <div className='flex items-center justify-between border-t px-4 py-3'>
          <Skeleton className='h-3 w-40' />
          <Skeleton className='h-8 w-28' />
        </div>
      </Card>
    ))}
  </div>
);

export default PurchasesSkeleton;
