import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PaymentsSkeleton = ({ count = 5 }: { count?: number }) => (
  <Card className='gap-0 divide-y divide-border/60 py-0' aria-busy>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className='flex items-center gap-4 px-4 py-4'>
        <Skeleton className='size-11 rounded-lg' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-3 w-1/3' />
        </div>
        <Skeleton className='h-5 w-16' />
        <Skeleton className='h-5 w-20' />
      </div>
    ))}
  </Card>
);

export default PaymentsSkeleton;
