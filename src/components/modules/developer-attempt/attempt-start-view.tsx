'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { FetchError } from 'ofetch';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ListChecks,
  Loader2,
  Play,
  RotateCcw,
  ShieldAlert,
  Target,
  TimerReset,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/layout/dashboard/page-header';
import { formatDuration } from '@/components/modules/public-assessments/catalog-utils';
import {
  attemptsHref,
  examHref,
  findResumable,
  formatClock,
  msLeft,
  writeDraft,
} from '@/components/modules/developer-attempt/attempt-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAssessmentAttempts, useGetOwnedAssessments, useGetPendingOrders, useStartAttempt } from '@/hooks';
import { useNow } from '@/hooks/use-now';
import { getApiErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/utils';

const RULES: { icon: LucideIcon; text: string }[] = [
  { icon: TimerReset, text: 'The timer starts the moment you click Start and cannot be paused.' },
  { icon: ListChecks, text: 'Every question must be answered before you can submit.' },
  { icon: CheckCircle2, text: 'Each question has exactly one correct option.' },
  {
    icon: ShieldAlert,
    text: 'Your answers are saved on this device as you go, so a refresh won’t lose them. Switching devices will.',
  },
  { icon: AlertTriangle, text: 'If time runs out before every question is answered, the attempt can’t be scored.' },
];

const BackLink = ({ assessmentId }: { assessmentId: string }) => (
  <Link
    href={`/developer/assessments/detail?id=${assessmentId}`}
    className='inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
  >
    <ArrowLeft className='size-4' /> Back to assessment
  </Link>
);

const Notice = ({ tone, children }: { tone: 'info' | 'warning' | 'danger'; children: React.ReactNode }) => (
  <div
    role='status'
    className={cn(
      'rounded-lg border p-3 text-sm',
      tone === 'info' && 'border-primary/30 bg-primary/5',
      tone === 'warning' && 'border-amber-500/30 bg-amber-500/5',
      tone === 'danger' && 'border-destructive/30 bg-destructive/5',
    )}
  >
    {children}
  </div>
);

const AttemptStartView = ({ assessmentId }: { assessmentId: string }) => {
  const router = useRouter();
  const now = useNow();
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const attemptsQuery = useGetAssessmentAttempts(assessmentId, { limit: 10 });
  const owned = useGetOwnedAssessments();
  const pending = useGetPendingOrders();
  const start = useStartAttempt();

  if (attemptsQuery.isPending || owned.isPending) {
    return (
      <div className='flex flex-col gap-6'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-16 w-96 max-w-full' />
        <div className='grid gap-6 lg:grid-cols-[1fr_22rem]'>
          <Skeleton className='h-80 rounded-xl' />
          <Skeleton className='h-60 rounded-xl' />
        </div>
      </div>
    );
  }

  if (attemptsQuery.isError) {
    const { error } = attemptsQuery;
    if (error instanceof FetchError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <Card className='items-center gap-3 px-4 py-12 text-center'>
        <p className='text-sm text-muted-foreground'>We couldn&apos;t load this assessment. Please try again.</p>
        <Button variant='outline' onClick={() => attemptsQuery.refetch()}>
          Retry
        </Button>
      </Card>
    );
  }

  const { assessment, attempts } = attemptsQuery.data.data;
  const isOwned = owned.data?.some((a) => a.id === assessmentId) ?? false;
  const pendingOrder = pending.data?.[assessmentId];
  const available = assessment.status === 'PUBLISHED';
  const resumable = findResumable(attempts, now);
  const canStart = isOwned && available && !start.isPending && !start.isSuccess;

  const handleStart = () => {
    // A GET that creates an attempt: only ever fired from this click, never on render.
    start.mutate(
      { assessmentId, assessment },
      {
        onSuccess: ({ data }) => {
          writeDraft(data.id, {
            answers: {},
            flagged: [],
            current: 0,
            clockSkew: new Date(data.startedAt).getTime() - Date.now(),
          });
          router.push(examHref(assessmentId, data.id));
        },
        onError: (err) => {
          if (err instanceof FetchError && err.status === 403) owned.refetch();
          if (err instanceof FetchError && err.status === 404) attemptsQuery.refetch();
          toast.error(getApiErrorMessage(err, 'Could not start the assessment. Please try again.'));
        },
      },
    );
  };

  let blocker: React.ReactNode = null;
  if (!available) {
    blocker = (
      <Notice tone='danger'>
        This assessment is no longer available, so new attempts can&apos;t be started. Your past attempts are still in{' '}
        <Link href={attemptsHref(assessmentId)} className='font-medium underline'>
          your history
        </Link>
        .
      </Notice>
    );
  } else if (!isOwned) {
    blocker = (
      <div className='flex flex-col gap-3'>
        <Notice tone='warning'>
          {pendingOrder
            ? 'You have an unpaid order for this assessment. Complete the payment to unlock it.'
            : 'You need to purchase this assessment before you can take it.'}
        </Notice>
        {pendingOrder ? (
          <PayOrderButton purchaseId={pendingOrder.purchaseId} label='Complete payment' />
        ) : (
          <Button nativeButton={false} render={<Link href={`/assessments/detail?id=${assessmentId}`} />}>
            View purchase options
          </Button>
        )}
      </div>
    );
  }

  const startButton = (
    <Button
      size='lg'
      variant={resumable ? 'outline' : 'default'}
      disabled={!canStart || !ready || (Boolean(resumable) && !confirmNew)}
      onClick={handleStart}
    >
      {start.isPending || start.isSuccess ? <Loader2 className='animate-spin' /> : resumable ? <RotateCcw /> : <Play />}
      {start.isPending ? 'Starting…' : start.isSuccess ? 'Opening…' : resumable ? 'Start a new attempt' : attempts.length ? 'Start new attempt' : 'Start assessment'}
    </Button>
  );

  return (
    <div className='flex flex-col gap-6'>
      <BackLink assessmentId={assessmentId} />
      <PageHeader title={assessment.title} description='Read the rules below before you begin.' />

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_22rem]'>
        <Card>
          <CardHeader>
            <CardTitle>Before you start</CardTitle>
            <CardDescription>These rules apply to every attempt.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='flex flex-col gap-4'>
              {RULES.map(({ icon: Icon, text }) => (
                <li key={text} className='flex items-start gap-3 text-sm'>
                  <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Icon className='size-4' aria-hidden />
                  </span>
                  <span className='pt-1.5'>{text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className='lg:sticky lg:top-20'>
          <CardHeader>
            <CardTitle>{resumable ? 'You have an attempt running' : 'Ready when you are'}</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-5'>
            <dl className='grid grid-cols-2 gap-3'>
              <div className='rounded-lg bg-muted/50 p-3'>
                <dt className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <Clock className='size-3.5' aria-hidden /> Time limit
                </dt>
                <dd className='font-heading text-lg font-semibold tabular-nums'>{formatDuration(assessment.duration)}</dd>
              </div>
              <div className='rounded-lg bg-muted/50 p-3'>
                <dt className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <Target className='size-3.5' aria-hidden /> Pass mark
                </dt>
                <dd className='font-heading text-lg font-semibold tabular-nums'>{assessment.passingPercentage}%</dd>
              </div>
            </dl>

            {blocker ?? (
              <>
                {resumable && (
                  <div className='flex flex-col gap-3'>
                    <Button size='lg' nativeButton={false} render={<Link href={examHref(assessmentId, resumable.id)} />}>
                      <Play />
                      Resume · {formatClock(msLeft(resumable, now))} left
                    </Button>
                    <label className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <Checkbox checked={confirmNew} onCheckedChange={(v) => setConfirmNew(v === true)} className='mt-0.5' />
                      Abandon the running attempt and start over. It will never be scored.
                    </label>
                  </div>
                )}
                <label className='flex items-start gap-2 text-sm'>
                  <Checkbox checked={ready} onCheckedChange={(v) => setReady(v === true)} className='mt-0.5' />
                  I&apos;ve read the rules and I&apos;m ready to begin.
                </label>
                {startButton}
              </>
            )}

            {attempts.length > 0 && (
              <Link href={attemptsHref(assessmentId)} className='text-center text-sm text-muted-foreground hover:text-foreground'>
                View your previous attempts
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttemptStartView;
