'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Clock, Search, Sparkles, Target } from 'lucide-react';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import { getCatalogInsights, useHomeCatalog } from '@/components/modules/homepage/home-utils';
import AssessmentCover from '@/components/modules/public-assessments/assessment-cover';
import { averageRating, creatorName, formatDuration } from '@/components/modules/public-assessments/catalog-utils';
import { Container } from '@/components/layout/public/marketing-section';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CatalogAssessment } from '@/types/assessment.types';

const ROTATING_SKILLS = ['React', 'Node.js', 'TypeScript', 'SQL', 'system design'];
const SLIDE_MS = 5000;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const RotatingSkill = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % ROTATING_SKILLS.length), 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className='relative inline-block'>
      <span
        key={index}
        className='inline-block text-sky-600 dark:text-sky-400 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500'
      >
        {ROTATING_SKILLS[index]}
      </span>
    </span>
  );
};

const HeroSearch = () => {
  const router = useRouter();
  const [value, setValue] = useState('');

  return (
    <form
      role='search'
      className='flex w-full max-w-xl flex-col gap-2 sm:flex-row'
      onSubmit={(e) => {
        e.preventDefault();
        const search = value.trim();
        router.push(search ? `/assessments?search=${encodeURIComponent(search)}` : '/assessments');
      }}
    >
      <label htmlFor='hero-search' className='sr-only'>
        Search assessments
      </label>
      <div className='relative flex-1'>
        <Search className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground' aria-hidden />
        <Input
          id='hero-search'
          type='search'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Try “React”, “SQL” or “Node.js”'
          className='h-11 rounded-xl bg-background pl-10 text-base shadow-sm md:text-sm dark:bg-background/60'
        />
      </div>
      <Button type='submit' className='h-11 rounded-xl px-5'>
        Search
      </Button>
    </form>
  );
};

const Slide = ({ assessment }: { assessment: CatalogAssessment }) => {
  const average = averageRating(assessment.reviews);
  return (
    <Link
      href={`/assessments/detail?id=${assessment.id}`}
      className='group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-foreground/10 outline-none focus-visible:ring-3 focus-visible:ring-ring/60'
    >
      <AssessmentCover
        id={assessment.id}
        title={assessment.title}
        tags={assessment.tags}
        src={assessment.thumbnailUrl}
        eager
        className='aspect-[16/9] shrink-0'
      />
      <div className='flex flex-1 flex-col gap-3 p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='line-clamp-1 font-heading text-lg font-semibold tracking-tight'>{assessment.title}</p>
            <p className='truncate text-xs text-muted-foreground'>by {creatorName(assessment.creator)}</p>
          </div>
          <span className='shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary tabular-nums'>
            {formatMoney(assessment.price)}
          </span>
        </div>
        <p className='line-clamp-2 text-sm text-muted-foreground'>{assessment.description}</p>
        <div className='mt-auto flex items-center justify-between gap-3 text-xs text-muted-foreground'>
          {average !== null ? (
            <span className='flex items-center gap-1.5'>
              <Stars rating={average} className='size-3.5' />
              <span className='font-medium text-foreground tabular-nums'>{average.toFixed(1)}</span>
            </span>
          ) : (
            <span className='font-medium text-primary'>New</span>
          )}
          <span className='flex items-center gap-3'>
            <span className='flex items-center gap-1'>
              <Clock className='size-3.5' aria-hidden />
              {formatDuration(assessment.duration)}
            </span>
            <span className='flex items-center gap-1'>
              <Target className='size-3.5' aria-hidden />
              {assessment.passingPercentage}% to pass
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};

const FeaturedSlider = ({ slides }: { slides: CatalogAssessment[] }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2 || prefersReducedMotion()) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  if (count === 0) return null;
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div
      className='relative flex w-full flex-col gap-4'
      role='region'
      aria-roledescription='carousel'
      aria-label='Featured assessments'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className='overflow-hidden rounded-2xl'>
        <div
          className='flex transition-transform duration-700 ease-out motion-reduce:transition-none'
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className='w-full shrink-0 px-0.5 pb-1'
              role='group'
              aria-roledescription='slide'
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <Slide assessment={slide} />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type='button'
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  i === index ? 'w-6 bg-primary' : 'w-1.5 bg-foreground/25 hover:bg-foreground/40',
                )}
              />
            ))}
          </div>
          <div className='flex gap-1'>
            <Button variant='outline' size='icon-sm' aria-label='Previous slide' onClick={() => go(index - 1)}>
              <ChevronLeft />
            </Button>
            <Button variant='outline' size='icon-sm' aria-label='Next slide' onClick={() => go(index + 1)}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const HeroSection = () => {
  const { data, isPending } = useHomeCatalog();
  const insights = data ? getCatalogInsights(data.data, data.meta?.total ?? data.data.length) : null;

  return (
    <section className='relative isolate flex overflow-hidden border-b border-border/60 lg:h-[68svh] lg:max-h-[780px] lg:min-h-[560px]'>
      <div aria-hidden className='absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-background to-background' />
      <div
        aria-hidden
        className='absolute -top-32 -left-24 -z-10 size-[28rem] rounded-full bg-sky-500/20 blur-3xl motion-safe:animate-pulse'
      />
      <div aria-hidden className='absolute -right-24 -bottom-40 -z-10 size-[30rem] rounded-full bg-emerald-500/10 blur-3xl' />
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-[size:48px_48px] opacity-40'
      />

      <Container className='grid min-h-[60svh] items-center gap-10 py-12 sm:py-16 lg:min-h-0 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:py-0'>
        <div className='flex min-w-0 flex-col items-start gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700'>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
            <Sparkles className='size-3.5' aria-hidden />
            {insights ? `${insights.total} expert-built assessments live` : 'Expert-built technical assessments'}
          </span>
          <h1 className='font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl'>
            Prove your <RotatingSkill /> skills with real-world assessments
          </h1>
          <p className='max-w-xl text-base text-pretty text-muted-foreground sm:text-lg'>
            Timed, hands-on tests designed by experienced evaluators. Buy once, take it when you&apos;re ready, and
            get a clear pass mark you can point to.
          </p>
          <HeroSearch />
          <div className='flex flex-wrap items-center gap-3'>
            <Link href='/assessments' className={cn(buttonVariants({ size: 'lg' }), 'h-10 px-4')}>
              Browse assessments
              <ArrowRight />
            </Link>
            <Link href='/register' className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-10 px-4')}>
              Publish as an evaluator
            </Link>
          </div>
        </div>

        <div className='hidden w-full max-w-md min-w-0 justify-self-center lg:block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-6 motion-safe:duration-700 lg:max-w-[30rem] lg:justify-self-end'>
          {isPending ? (
            <div className='flex flex-col gap-4'>
              <Skeleton className='aspect-[16/9] w-full rounded-2xl' />
              <Skeleton className='h-28 w-full rounded-2xl' />
            </div>
          ) : (
            insights && <FeaturedSlider slides={insights.featured.slice(0, 5)} />
          )}
        </div>
      </Container>

      <a
        href='#stats'
        aria-label='Scroll to the next section'
        className='absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center justify-center rounded-full p-2 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 lg:flex'
      >
        <ChevronDown className='size-5 motion-safe:animate-bounce' />
      </a>
    </section>
  );
};

export default HeroSection;
