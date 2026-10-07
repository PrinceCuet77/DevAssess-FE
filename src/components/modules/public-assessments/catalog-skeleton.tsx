import { Skeleton } from '@/components/ui/skeleton';

export const CatalogGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3' aria-busy aria-label='Loading assessments'>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className='overflow-hidden rounded-xl ring-1 ring-foreground/10'>
        <Skeleton className='aspect-[16/9] rounded-none' />
        <div className='flex flex-col gap-3 p-4'>
          <div className='flex gap-1.5'>
            <Skeleton className='h-4 w-12 rounded-full' />
            <Skeleton className='h-4 w-16 rounded-full' />
          </div>
          <Skeleton className='h-5 w-4/5' />
          <Skeleton className='h-3 w-1/3' />
          <div className='space-y-2'>
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-3/4' />
          </div>
          <Skeleton className='mt-2 h-4 w-full' />
        </div>
      </div>
    ))}
  </div>
);

// Route-level fallback while search params resolve.
const CatalogSkeleton = () => (
  <div className='flex flex-col'>
    <div className='border-b border-border/60 py-14'>
      <div className='mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-10 w-full max-w-xl' />
        <Skeleton className='h-12 w-full max-w-2xl rounded-xl' />
      </div>
    </div>
    <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <CatalogGridSkeleton />
    </div>
  </div>
);

export default CatalogSkeleton;
