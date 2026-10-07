'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { FetchError } from 'ofetch';
import {
  ArrowLeft,
  Ban,
  CalendarCheck,
  Clock,
  History,
  Info,
  Play,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  Star,
  Target,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import AssessmentAttemptsTable from '@/components/modules/developer-assessments/assessment-attempts-table';
import AssessmentReviewsPanel, { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import { examHref, findResumable, formatClock, msLeft, takeHref } from '@/components/modules/developer-attempt/attempt-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import ReviewFormDialog from '@/components/modules/developer-reviews/review-form-dialog';
import { formatDuration } from '@/components/modules/public-assessments/catalog-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAssessmentAttempts,
  useGetAssessmentReviews,
  useGetMyAssessmentReview,
  useGetOwnedAssessments,
  useGetPendingOrders,
} from '@/hooks';
import { useNow } from '@/hooks/use-now';
import { cn } from '@/lib/utils';

const TABS = ['overview', 'attempts', 'reviews'] as const;
type Tab = (typeof TABS)[number];

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
  const tabParam = useSearchParams().get('tab');
  const [tab, setTab] = useState<Tab>(TABS.find((t) => t === tabParam) ?? 'overview');
  const now = useNow();
  // The attempts endpoint returns the assessment in any status, so this page keeps working after
  // the evaluator unpublishes it (the catalog endpoint would 404).
  const summary = useGetAssessmentAttempts(assessmentId, { limit: 100 });
  const owned = useGetOwnedAssessments();
  const pending = useGetPendingOrders();
  const assessment = summary.data?.data.assessment;
  const available = assessment?.status === 'PUBLISHED';
  const reviews = useGetAssessmentReviews(assessmentId, { sortBy: 'createdAt', sortOrder: 'desc', limit: 100 });
  const attempts = summary.data?.data.attempts ?? [];
  const evaluated = attempts.filter((a) => a.status === 'EVALUATED');
  const myReview = useGetMyAssessmentReview(evaluated.length > 0 ? assessment : undefined);

  if (summary.isPending || owned.isPending) return <DetailSkeleton />;

  if (!assessment) {
    // 404 = no such assessment; 400 = malformed id.
    if (summary.error instanceof FetchError && (summary.error.status === 404 || summary.error.status === 400)) notFound();
    return (
      <div className='flex flex-col gap-4'>
        <BackLink />
        <Card className='items-center gap-3 px-4 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>We couldn&apos;t load this assessment. Please try again.</p>
          <Button variant='outline' onClick={() => summary.refetch()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const purchase = owned.data?.find((a) => a.id === assessment.id);
  const isOwned = Boolean(purchase);
  // Drafts and archived assessments are only visible to developers who bought them earlier.
  if (!available && !isOwned && !owned.isError) notFound();

  const pendingOrder = pending.data?.[assessment.id];
  const totalAttempts = summary.data?.meta?.total ?? attempts.length;
  const bestScore = evaluated.length ? Math.max(...evaluated.map((a) => a.score ?? 0)) : null;
  const hasPassed = evaluated.some((a) => a.isPassed);
  const resumable = findResumable(attempts, now);
  const creator = assessment.creator.name ?? assessment.creator.email.split('@')[0];
  const reviewRows = reviews.data?.pages.flatMap((p) => p.data) ?? [];
  const reviewTotal = reviews.data?.pages[0]?.meta?.total ?? reviewRows.length;
  const average = reviewRows.length ? reviewRows.reduce((sum, r) => sum + r.rating, 0) / reviewRows.length : null;
  // Reviews need an EVALUATED attempt, and only one active review is allowed per assessment.
  const canReview = evaluated.length > 0 && myReview.isSuccess && !myReview.data;

  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'attempts', label: `Attempts (${totalAttempts})`, icon: History },
    ...(available ? [{ id: 'reviews' as const, label: `Reviews${reviews.data ? ` (${reviewTotal})` : ''}`, icon: Star }] : []),
  ];

  let primaryAction: React.ReactNode;
  if (!isOwned) {
    primaryAction = pendingOrder ? (
      <div className='flex flex-col gap-2'>
        <p role='status' className='rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm'>
          You have an unpaid order for this assessment. Complete the payment to unlock it.
        </p>
        <PayOrderButton purchaseId={pendingOrder.purchaseId} label='Complete payment' />
      </div>
    ) : (
      <div className='flex flex-col gap-2'>
        <p role='status' className='rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm'>
          You haven&apos;t purchased this assessment yet, so it can&apos;t be started.
        </p>
        <Button size='lg' nativeButton={false} render={<Link href={`/assessments/detail?id=${assessment.id}`} />}>
          <ShoppingCart /> Buy this assessment
        </Button>
      </div>
    );
  } else if (!available) {
    primaryAction = (
      <p role='status' className='flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm'>
        <Ban className='mt-0.5 size-4 shrink-0 text-destructive' aria-hidden />
        The evaluator has withdrawn this assessment. New attempts can&apos;t be started, but your history stays available.
      </p>
    );
  } else if (resumable) {
    primaryAction = (
      <div className='flex flex-col gap-2'>
        <Button size='lg' nativeButton={false} render={<Link href={examHref(assessment.id, resumable.id)} />}>
          <Play /> Resume · {formatClock(msLeft(resumable, now))} left
        </Button>
        <Button variant='outline' nativeButton={false} render={<Link href={takeHref(assessment.id)} />}>
          <RotateCcw /> Start a new attempt
        </Button>
      </div>
    );
  } else {
    primaryAction = (
      <Button size='lg' nativeButton={false} render={<Link href={takeHref(assessment.id)} />}>
        {totalAttempts > 0 ? <RotateCcw /> : <Play />}
        {totalAttempts > 0 ? 'Retake assessment' : 'Start assessment'}
      </Button>
    );
  }

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
            {!available && <Badge variant='destructive'>No longer available</Badge>}
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
                  {average.toFixed(1)} ({reviewTotal})
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
                  <p className='text-sm leading-relaxed break-words whitespace-pre-line'>{assessment.description}</p>
                  <ul className='flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground'>
                    <li>You have {formatDuration(assessment.duration)} once you start. The timer cannot be paused.</li>
                    <li>Answer every question before finishing; you need {assessment.passingPercentage}% to pass.</li>
                    <li>Retakes are allowed. Each attempt is recorded in your history.</li>
                  </ul>
                </CardContent>
              </Card>
            )}
            {tab === 'attempts' && <AssessmentAttemptsTable assessmentId={assessment.id} bestScore={bestScore} />}
            {tab === 'reviews' && available && (
              <AssessmentReviewsPanel
                assessmentId={assessment.id}
                assessmentTitle={assessment.title}
                myReview={myReview.data}
                canReview={canReview}
              />
            )}
          </div>
        </div>

        <aside className='flex flex-col gap-4 lg:sticky lg:top-20'>
          <Card>
            <CardHeader>
              <CardTitle>{resumable ? 'Attempt in progress' : totalAttempts > 0 ? 'Your progress' : 'Ready when you are'}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-5'>
              {totalAttempts > 0 && (
                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-lg bg-muted/50 p-3'>
                    <p className='text-xs text-muted-foreground'>Attempts</p>
                    <p className='font-heading text-xl font-semibold tabular-nums'>{totalAttempts}</p>
                  </div>
                  <div className='rounded-lg bg-muted/50 p-3'>
                    <p className='text-xs text-muted-foreground'>Best score</p>
                    <p className='font-heading text-xl font-semibold tabular-nums'>
                      {bestScore ?? '-'}
                      {bestScore !== null && <span className='ml-1 text-xs font-normal text-muted-foreground'>marks</span>}
                    </p>
                  </div>
                </div>
              )}

              {primaryAction}

              {canReview && <ReviewFormDialog mode='create' assessmentId={assessment.id} assessmentTitle={assessment.title} />}
              {myReview.data && (
                <div className='flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2'>
                  <span className='flex items-center gap-2 text-sm'>
                    Your rating <Stars rating={myReview.data.rating} className='size-3.5' />
                  </span>
                  <ReviewFormDialog
                    mode='edit'
                    reviewId={myReview.data.id}
                    assessmentTitle={assessment.title}
                    rating={myReview.data.rating}
                    comment={myReview.data.comment}
                  />
                </div>
              )}

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
