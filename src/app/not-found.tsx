'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background'>
      {/* Decorative grid + glow */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40 mask-[radial-gradient(ellipse_60%_55%_at_50%_45%,#000_30%,transparent_100%)]'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-[38%] size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]'
      />

      <main className='relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center'>
        <h1 className='mt-6 bg-linear-to-b from-foreground to-foreground/30 bg-clip-text font-mono text-[7rem] leading-none font-bold tracking-tighter text-transparent sm:text-[10rem]'>
          404
        </h1>

        <h2 className='mt-4 text-2xl font-semibold tracking-tight sm:text-3xl'>
          This page failed the assessment
        </h2>
        <p className='mt-3 max-w-md text-sm text-muted-foreground sm:text-base'>
          We couldn&apos;t find what you were looking for. It may have been
          moved, deleted, or the link might be mistyped.
        </p>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Button size='lg' className='h-10 px-4' onClick={() => router.back()}>
            <ArrowLeft data-icon='inline-start' />
            Go back
          </Button>
          <Link
            href='/'
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-10 px-4',
            )}
          >
            Take me home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
