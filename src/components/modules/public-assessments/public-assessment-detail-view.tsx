'use client';

import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { FetchError } from 'ofetch';
import {
  CalendarDays,
  ChevronRight,
  Clock,
  CreditCard,
  ListChecks,
  MessageSquareText,
  PlayCircle,
  Tag,
  UserRound,
  RotateCcw,
  Target,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import AssessmentCover from '@/components/modules/public-assessments/assessment-cover';
import {
  averageRating,
  creatorName,
  formatDate,
  formatDuration,
  initials,
} from '@/components/modules/public-assessments/catalog-utils';
import PublicReviewsSection from '@/components/modules/public-assessments/public-reviews-section';
import PurchaseAction from '@/components/modules/public-assessments/purchase-action';
import RelatedAssessments from '@/components/modules/public-assessments/related-assessments';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAssessment } from '@/hooks';
import { cn } from '@/lib/utils';
import type { CatalogAssessment } from '@/types/assessment.types';

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
);

const Breadcrumb = ({ title }: { title?: string }) => (
  <nav aria-label='Breadcrumb'>
    <ol className='flex min-w-0 items-center gap-1 text-sm text-muted-foreground'>
      <li>
        <Link href='/assessments' className='hover:text-foreground'>
          Assessments
        </Link>
      </li>
      {title && (
        <>
          <ChevronRight className='size-3.5 shrink-0' aria-hidden />
          <li className='truncate text-foreground' aria-current='page'>
            {title}
          </li>
        </>
      )}
    </ol>
  </nav>
);

const Includes = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <div className='flex items-center gap-3'>
    <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
      <Icon className='size-4' aria-hidden />
    </span>
    <div className='flex min-w-0 flex-1 items-center justify-between gap-2'>
      <dt className='text-sm text-muted-foreground'>{label}</dt>
      <dd className='truncate text-sm font-medium tabular-nums'>{value}</dd>
    </div>
  </div>
);

const Spec = ({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) => (
  <div className='flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10'>
    <span className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
      <Icon className='size-4' aria-hidden />
    </span>
    <div className='flex min-w-0 flex-col gap-0.5'>
      <dt className='text-xs text-muted-foreground'>{label}</dt>
      <dd className='text-sm font-medium break-words'>{children}</dd>
    </div>
  </div>
);

const STEPS = (a: CatalogAssessment) => [
  {
    icon: CreditCard,
    title: 'Purchase once',
    body: 'Pay securely and the assessment is added to your developer dashboard right away.',
  },
  {
    icon: PlayCircle,
    title: 'Start when ready',
    body: `You get ${formatDuration(a.duration)} once you begin. The timer can’t be paused, so pick a quiet moment.`,
  },
  {
    icon: Trophy,
    title: 'Get your result',
    body: `Score ${a.passingPercentage}% or higher to pass. Retakes are allowed and every attempt is kept in your history.`,
  },
];

const DetailSkeleton = () => (
  <div className='flex flex-col'>
    <div className='border-b border-border/60 py-10'>
      <Container className='grid gap-10 lg:grid-cols-[1fr_24rem]'>
        <div className='flex flex-col gap-4'>
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-5 w-32 rounded-full' />
          <Skeleton className='h-10 w-3/4' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
          <Skeleton className='h-5 w-80' />
        </div>
        <Skeleton className='hidden aspect-[16/10] rounded-2xl lg:block' />
      </Container>
    </div>
    <Container className='grid gap-10 py-10 lg:grid-cols-[1fr_24rem]'>
      <Skeleton className='h-80 rounded-xl' />
      <Skeleton className='h-80 rounded-xl' />
    </Container>
  </div>
);

const PublicAssessmentDetailView = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  const { data: assessment, error, isPending, refetch } = useGetAssessment(id);

  if (isPending) return <DetailSkeleton />;

  if (!assessment) {
    // 404 covers drafts/archived/deleted assessments; 400 a malformed id.
    if (error instanceof FetchError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <Container className='flex flex-col gap-6 py-10'>
        <Breadcrumb />
        <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center'>
          <p className='text-sm text-muted-foreground'>We couldn&apos;t load this assessment. Please try again.</p>
          <Button variant='outline' onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Container>
    );
  }

  const creator = creatorName(assessment.creator);
  const average = averageRating(assessment.reviews);
  const reviewCount = assessment.reviews.length;

  return (
    <div className='flex flex-col pb-24 lg:pb-0'>
      <title>{`${assessment.title} | DevAssess`}</title>

      <section className='relative isolate overflow-hidden border-b border-border/60'>
        <div aria-hidden className='absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background' />
        <div aria-hidden className='absolute -top-32 -right-32 -z-10 size-96 rounded-full bg-primary/15 blur-3xl' />
        <Container className='grid items-center gap-8 py-8 lg:grid-cols-[1fr_24rem] lg:gap-10 lg:py-12'>
          <div className='flex min-w-0 flex-col gap-5'>
            <Breadcrumb title={assessment.title} />

            {assessment.tags.length > 0 && (
              <ul className='flex flex-wrap gap-1.5' aria-label='Topics'>
                {assessment.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/assessments?tags=${encodeURIComponent(tag)}`}
                      className='inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20'
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <h1 className='font-heading text-3xl font-semibold tracking-tight text-balance break-words sm:text-4xl'>
              {assessment.title}
            </h1>

            <p className='line-clamp-3 max-w-2xl text-base text-pretty text-muted-foreground'>
              {assessment.description}
            </p>

            <div className='flex flex-wrap items-center gap-x-5 gap-y-3 text-sm'>
              {average !== null ? (
                <a href='#reviews' className='flex items-center gap-1.5 rounded hover:underline'>
                  <span className='font-semibold text-amber-500 tabular-nums'>{average.toFixed(1)}</span>
                  <Stars rating={average} className='size-4' />
                  <span className='text-muted-foreground tabular-nums'>
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </a>
              ) : (
                <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'>
                  New - no reviews yet
                </span>
              )}
              <span className='flex items-center gap-2'>
                <span
                  aria-hidden
                  className='flex size-7 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background'
                >
                  {initials(creator)}
                </span>
                <span className='text-muted-foreground'>
                  Created by <span className='font-medium text-foreground'>{creator}</span>
                </span>
              </span>
              {assessment.publishedAt && (
                <span className='flex items-center gap-1.5 text-muted-foreground'>
                  <CalendarDays className='size-4' aria-hidden />
                  Published {formatDate(assessment.publishedAt)}
                </span>
              )}
            </div>
          </div>

          <AssessmentCover
            id={assessment.id}
            title={assessment.title}
            tags={assessment.tags}
            src={assessment.thumbnailUrl}
            eager
            className='aspect-[16/10] rounded-2xl shadow-xl ring-1 ring-foreground/10'
          />
        </Container>
      </section>

      <Container className='grid items-start gap-10 py-10 lg:grid-cols-[1fr_24rem]'>
        <div className='flex min-w-0 flex-col gap-12'>
          <section aria-labelledby='about-heading' className='flex flex-col gap-4'>
            <h2 id='about-heading' className='font-heading text-xl font-semibold tracking-tight'>
              About this assessment
            </h2>
            <p className='text-[15px] leading-7 break-words whitespace-pre-line text-foreground/90'>
              {assessment.description}
            </p>
          </section>

          <section aria-labelledby='specs-heading' className='flex flex-col gap-4'>
            <h2 id='specs-heading' className='font-heading text-xl font-semibold tracking-tight'>
              Key information
            </h2>
            <dl className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
              <Spec icon={Clock} label='Time limit'>
                {formatDuration(assessment.duration)}
              </Spec>
              <Spec icon={Target} label='Pass mark'>
                {assessment.passingPercentage}% correct answers
              </Spec>
              <Spec icon={CreditCard} label='Price'>
                {formatMoney(assessment.price)} · one-time
              </Spec>
              <Spec icon={ListChecks} label='Format'>
                Multiple choice, auto-graded
              </Spec>
              <Spec icon={RotateCcw} label='Retakes'>
                Allowed, all attempts kept
              </Spec>
              <Spec icon={UserRound} label='Evaluator'>
                {creator}
              </Spec>
              <Spec icon={CalendarDays} label='Published'>
                {formatDate(assessment.publishedAt ?? assessment.createdAt)}
              </Spec>
              <Spec icon={MessageSquareText} label='Rating'>
                {average !== null
                  ? `${average.toFixed(1)} / 5 from ${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`
                  : 'No reviews yet'}
              </Spec>
              <Spec icon={Tag} label='Topics'>
                {assessment.tags.length ? assessment.tags.join(', ') : 'General'}
              </Spec>
            </dl>
          </section>

          <section aria-labelledby='how-heading' className='flex flex-col gap-4'>
            <h2 id='how-heading' className='font-heading text-xl font-semibold tracking-tight'>
              How it works
            </h2>
            <ol className='grid gap-4 sm:grid-cols-3'>
              {STEPS(assessment).map((step, i) => (
                <li key={step.title} className='relative flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10'>
                  <div className='flex items-center justify-between'>
                    <span className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                      <step.icon className='size-5' aria-hidden />
                    </span>
                    <span className='font-mono text-xs text-muted-foreground' aria-hidden>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className='text-sm font-semibold'>{step.title}</h3>
                  <p className='text-sm leading-relaxed text-muted-foreground'>{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <PublicReviewsSection assessmentId={assessment.id} embeddedReviews={assessment.reviews} />
        </div>

        <aside className='order-first lg:order-none lg:sticky lg:top-24' aria-label='Purchase'>
          <div className='flex flex-col gap-5 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-foreground/10'>
            <div className='flex flex-col gap-1'>
              <span className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>One-time price</span>
              <span className='font-heading text-3xl font-semibold tracking-tight tabular-nums'>
                {formatMoney(assessment.price)}
              </span>
            </div>

            <PurchaseAction assessment={assessment} />

            <div className='flex flex-col gap-3 border-t border-border/60 pt-5'>
              <p className='text-sm font-semibold'>This assessment includes</p>
              <dl className='flex flex-col gap-3'>
                <Includes icon={Clock} label='Time limit' value={formatDuration(assessment.duration)} />
                <Includes icon={Target} label='Pass mark' value={`${assessment.passingPercentage}%`} />
                <Includes icon={RotateCcw} label='Retakes' value='Allowed' />
              </dl>
            </div>
          </div>
        </aside>
      </Container>

      <Container className='border-t border-border/60 py-12'>
        <RelatedAssessments assessment={assessment} />
      </Container>

      {/* Mobile: keep the price and primary action within thumb reach while reading. */}
      <div className='fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/90 px-4 py-3 backdrop-blur lg:hidden'>
        <div className='mx-auto flex max-w-7xl items-center gap-4'>
          <div className='flex shrink-0 flex-col'>
            <span className='text-[11px] text-muted-foreground'>Price</span>
            <span className='font-heading text-lg font-semibold tabular-nums'>{formatMoney(assessment.price)}</span>
          </div>
          <div className='min-w-0 flex-1'>
            <PurchaseAction assessment={assessment} compact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicAssessmentDetailView;
