'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FetchError } from 'ofetch';
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  History,
  Info,
  Play,
  RotateCcw,
  ShoppingBag,
  Star,
  Target,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import AssessmentAttemptsTable from '@/components/modules/developer-assessments/assessment-attempts-table';
import AssessmentReviewsPanel, { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import ReviewFormDialog from '@/components/modules/developer-reviews/review-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAssessmentAttempts, useGetDeveloperAssessment, useGetMyProfile, useGetOwnedAssessments } from '@/hooks';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'attempts' | 'reviews';

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });

const Fact = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <div className='flex items-center gap-3'>
    <span className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
      <Icon className='size-4' aria-hidden />
    </span>
    <div className='min-w-0'>
      <dt className='text-xs text-muted-foreground'>{label}</dt>
      <dd className='truncate text-sm font-medium tabular-nums'>{value}</dd>
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className='flex flex-col gap-6'>
    <Skeleton className='h-4 w-40' />
    <Skeleton className='h-64 w-full rounded-xl' />
    <div className='grid gap-6 lg:grid-cols-[1fr_22rem]'>
      <Skeleton className='h-72 rounded-xl' />
      <Skeleton className='h-72 rounded-xl' />
    </div>
  </div>
);

const BackLink = () => (
  <Link
    href='/developer/my-assessments'
    className='inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
  >
    <ArrowLeft className='size-4' /> Back to my assessments
  </Link>
);

const DeveloperAssessmentDetailView = ({ assessmentId }: { assessmentId: string }) => {
  const [tab, setTab] = useState<Tab>('overview');
  const assessmentQuery = useGetDeveloperAssessment(assessmentId);
  const owned = useGetOwnedAssessments();
  const attemptsQuery = useGetAssessmentAttempts(assessmentId);
  const profile = useGetMyProfile();

  const { data: assessment, error, isPending, refetch } = assessmentQuery;

  if (isPending) return <DetailSkeleton />;

  if (!assessment) {
    // 404 covers unpublished/nonexistent assessments; 400 a malformed id.
    if (error instanceof FetchError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <div className='flex flex-col gap-4'>
        <BackLink />
        <Card className='items-center gap-3 px-4 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>We couldn&apos;t load this assessment. Please try again.</p>
          <Button variant='outline' onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const purchase = owned.data?.find((a) => a.id === assessment.id);
  const ownershipKnown = !owned.isPending && !owned.isError;
  const isOwned = Boolean(purchase);
  const attempts = attemptsQuery.data ?? [];
  const evaluated = attempts.filter((a) => a.status === 'EVALUATED');
  const bestScore = evaluated.reduce<number | null>((best, a) => Math.max(best ?? 0, a.score ?? 0), null);
  const hasPassed = evaluated.some((a) => a.isPassed);
  const creator = assessment.creator.name ?? assessment.creator.email.split('@')[0];
  const average = assessment.reviews.length
    ? assessment.reviews.reduce((sum, r) => sum + r.rating, 0) / assessment.reviews.length
    : null;
  const hasAttempted = attempts.length > 0;
  // Reviews need an EVALUATED attempt, and only one active review is allowed per assessment.
  const myId = profile.data?.id;
  const hasReviewed = Boolean(myId) && assessment.reviews.some((r) => r.developer.id === myId);
  const canReview = evaluated.length > 0 && Boolean(myId) && !hasReviewed;

  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'attempts', label: `Attempts${attemptsQuery.data ? ` (${attempts.length})` : ''}`, icon: History },
    { id: 'reviews', label: `Reviews (${assessment.reviews.length})`, icon: Star },
  ];

  return (
    <div className='flex flex-col gap-6'>
      <BackLink />

      <Card className='overflow-hidden pt-0'>
        <div className='h-40 overflow-hidden bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-sky-500/30 sm:h-52'>
          {assessment.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- remote URLs from the API, no configured image domains
            <img src={assessment.thumbnailUrl} alt={assessment.title} className='size-full object-cover' />
          )}
        </div>
        <CardContent className='flex flex-col gap-3 pt-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='font-heading text-2xl font-semibold tracking-tight break-words'>{assessment.title}</h2>
            {isOwned && <Badge variant='success'>Purchased</Badge>}
            {hasPassed && (
              <Badge variant='default'>
                <Trophy className='size-3' /> Passed
              </Badge>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground'>
            <span>by {creator}</span>
            {average !== null && (
              <span className='flex items-center gap-1.5'>
                <Stars rating={average} className='size-3.5' />
                <span className='tabular-nums'>
                  {average.toFixed(1)} ({assessment.reviews.length})
                </span>
              </span>
            )}
          </div>
          {assessment.tags.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {assessment.tags.map((tag) => (
                <Badge key={tag} variant='secondary'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_22rem]'>
        <div className='flex min-w-0 flex-col gap-4'>
          <div role='tablist' aria-label='Assessment sections' className='flex gap-1 overflow-x-auto border-b border-border/60'>
            {tabs.map((t) => (
              <button
                key={t.id}
                type='button'
                role='tab'
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  '-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                  tab === t.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <t.icon className='size-4' aria-hidden />
                {t.label}
              </button>
            ))}
          </div>

          <div role='tabpanel'>
            {tab === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle>About this assessment</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                  <p className='text-sm leading-relaxed whitespace-pre-line'>{assessment.description}</p>
                  <ul className='flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground'>
                    <li>You have {formatDuration(assessment.duration)} once you start. The timer cannot be paused.</li>
                    <li>Answer every question before finishing; you need {assessment.passingPercentage}% to pass.</li>
                    <li>Retakes are allowed. Each attempt is recorded in your history.</li>
                  </ul>
                </CardContent>
              </Card>
            )}
            {tab === 'attempts' &&
              (attemptsQuery.isPending ? (
                <Skeleton className='h-48 rounded-xl' />
              ) : attemptsQuery.isError ? (
                <Card className='items-center gap-3 px-4 py-10 text-center'>
                  <p className='text-sm text-muted-foreground'>We couldn&apos;t load your attempts.</p>
                  <Button variant='outline' onClick={() => attemptsQuery.refetch()}>
                    Retry
                  </Button>
                </Card>
              ) : (
                <AssessmentAttemptsTable attempts={attempts} />
              ))}
            {tab === 'reviews' && <AssessmentReviewsPanel reviews={assessment.reviews} />}
          </div>
        </div>

        <aside className='flex flex-col gap-4 lg:sticky lg:top-20'>
          <Card>
            <CardHeader>
              <CardTitle>{hasAttempted ? 'Your progress' : 'Ready when you are'}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-5'>
              {hasAttempted && (
                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-lg bg-muted/50 p-3'>
                    <p className='text-xs text-muted-foreground'>Attempts</p>
                    <p className='font-heading text-xl font-semibold tabular-nums'>{attempts.length}</p>
                  </div>
                  <div className='rounded-lg bg-muted/50 p-3'>
                    <p className='text-xs text-muted-foreground'>Best score</p>
                    <p className='font-heading text-xl font-semibold tabular-nums'>{bestScore ?? '-'}</p>
                  </div>
                </div>
              )}

              {ownershipKnown && !isOwned ? (
                <div role='status' className='rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm'>
                  You haven&apos;t purchased this assessment yet, so it can&apos;t be started.
                </div>
              ) : (
                <Button
                  size='lg'
                  disabled={!isOwned}
                  nativeButton={false}
                  render={<Link href={`/developer/assessments/detail/take?id=${assessment.id}`} />}
                >
                  {hasAttempted ? <RotateCcw /> : <Play />}
                  {hasAttempted ? 'Retake assessment' : 'Start assessment'}
                </Button>
              )}

              {canReview && <ReviewFormDialog mode='create' assessmentId={assessment.id} assessmentTitle={assessment.title} />}

              <dl className='flex flex-col gap-4 border-t border-border/60 pt-5'>
                <Fact icon={Clock} label='Time limit' value={formatDuration(assessment.duration)} />
                <Fact icon={Target} label='Pass mark' value={`${assessment.passingPercentage}%`} />
                {purchase && (
                  <>
                    <Fact icon={CalendarCheck} label='Purchased on' value={formatDate(purchase.purchasedAt)} />
                    <Fact icon={ShoppingBag} label='Order' value={`#${purchase.purchaseId.slice(0, 8).toUpperCase()}`} />
                  </>
                )}
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default DeveloperAssessmentDetailView;
