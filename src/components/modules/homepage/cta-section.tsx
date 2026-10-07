import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/public/marketing-section';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CtaSection = () => (
  <section aria-labelledby='cta-heading' className='pb-16 sm:pb-20'>
    <Container>
      <div className='relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-xl sm:px-12'>
        <div aria-hidden className='absolute -top-24 -left-16 -z-10 size-72 rounded-full bg-white/15 blur-3xl' />
        <div aria-hidden className='absolute -right-16 -bottom-24 -z-10 size-72 rounded-full bg-black/15 blur-3xl' />
        <h2 id='cta-heading' className='mx-auto max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
          Ready to show what you can do?
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-base text-pretty text-primary-foreground/85'>
          Create a free account in under a minute. Browse as a developer or start publishing as an evaluator.
        </p>
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Link
            href='/register'
            className={cn(buttonVariants({ size: 'lg' }), 'h-10 bg-background px-5 text-foreground hover:bg-background/90')}
          >
            Create free account
            <ArrowRight />
          </Link>
          <Link
            href='/assessments'
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'lg' }),
              'h-10 px-5 text-primary-foreground ring-1 ring-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground',
            )}
          >
            Explore the catalog
          </Link>
        </div>
      </div>
    </Container>
  </section>
);

export default CtaSection;
