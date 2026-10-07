'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FetchError } from 'ofetch';
import { ArrowLeft, Check, Clock, History, Info, Play, RotateCcw, Trophy, X } from 'lucide-react';
import PageHeader from '@/components/layout/dashboard/page-header';
import AttemptStatusBadge from '@/components/modules/developer-attempt/attempt-status-badge';
import {
  attemptsHref,
  examHref,
  formatTimeTaken,
  isResumable,
  resultKey,
  takeHref,
  type StoredResult,
} from '@/components/modules/developer-attempt/attempt-utils';
import { formatDateTime } from '@/components/modules/admin-purchases/purchase-utils';
import ReviewFormDialog from '@/components/modules/developer-reviews/review-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAssessmentAttempts, useGetMyAssessmentReview } from '@/hooks';
import { useNow } from '@/hooks/use-now';
import { useStoredJson } from '@/lib/storage';
import { cn } from '@/lib/utils';
import type { AttemptAssessment } from '@/types/developer-assessments.types';

type Filter = 'all' | 'correct' | 'incorrect';

const BackLink = ({ assessmentId }: { assessmentId: string }) => (
  <Link
    href={`/developer/assessments/detail?id=${assessmentId}`}
    className='inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
  >
    <ArrowLeft className='size-4' /> Back to assessment
  </Link>
);

const ScoreRing = ({ percentage, passed }: { percentage: number; passed: boolean }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(percentage, 100));
  return (
    <div className='relative size-36 shrink-0'>
      <svg viewBox='0 0 120 120' className='size-full -rotate-90' aria-hidden>
        <circle cx='60' cy='60' r={radius} fill='none' strokeWidth='10' className='stroke-muted' />
        <circle
          cx='60'
          cy='60'
          r={radius}
          fill='none'
          strokeWidth='10'
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className={passed ? 'stroke-emerald-500' : 'stroke-destructive'}
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <span className='font-heading text-3xl font-semibold tabular-nums'>{Math.round(percentage * 10) / 10}%</span>
        <span className='text-xs text-muted-foreground'>score</span>
      </div>
    </div>
  );
};

// Retake / history / review actions shared by the full and the summary result.
const ResultActions = ({ assessment, evaluated }: { assessment: AttemptAssessment; evaluated: boolean }) => {
  const review = useGetMyAssessmentReview(evaluated ? assessment : undefined);
  const available = assessment.status === 'PUBLISHED';

  return (
    <div className='flex flex-wrap gap-2'>
      {available && (
        <Button nativeButton={false} render={<Link href={takeHref(assessment.id)} />}>
          <RotateCcw /> Retake
        </Button>
      )}
      <Button variant='outline' nativeButton={false} render={<Link href={attemptsHref(assessment.id)} />}>
        <History /> All attempts
      </Button>
      {evaluated && review.isSuccess && !review.data && (
        <ReviewFormDialog mode='create' assessmentId={assessment.id} assessmentTitle={assessment.title} />
      )}
      {review.data && (
        <ReviewFormDialog
          mode='edit'
          reviewId={review.data.id}
          assessmentTitle={assessment.title}
          rating={review.data.rating}
          comment={review.data.comment}
        />
      )}
      <Button variant='ghost' nativeButton={false} render={<Link href='/developer/my-assessments' />}>
        Back to library
      </Button>
    </div>
  );
};

const FullResult = ({ result }: { result: StoredResult }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const { assessment, evaluation, questions, attempt } = result;
  const correct = evaluation.questionResults.filter((q) => q.isCorrect).length;
  const optionText = (questionId: string, optionId: string | null) => {
    if (!optionId) return null;
    const question = questions.find((q) => q.id === questionId);
    const index = question?.options.findIndex((o) => o.id === optionId) ?? -1;
    return index >= 0 ? `${String.fromCharCode(65 + index)}. ${question!.options[index].text}` : optionId;
  };
  const rows = evaluation.questionResults
    .map((r, i) => ({ ...r, number: i + 1 }))
    .filter((r) => filter === 'all' || (filter === 'correct' ? r.isCorrect : !r.isCorrect));

  return (
    <>
      <Card>
        <CardContent className='flex flex-col items-center gap-6 sm:flex-row'>
          <ScoreRing percentage={evaluation.percentage} passed={evaluation.isPassed} />
          <div className='flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left'>
            <Badge variant={evaluation.isPassed ? 'success' : 'destructive'} className='h-6 px-3 text-sm'>
              {evaluation.isPassed ? (
                <>
                  <Trophy className='size-3.5' /> Passed
                </>
              ) : (
                'Not passed'
              )}
            </Badge>
            <p className='text-sm text-muted-foreground'>
              You scored{' '}
              <span className='font-semibold text-foreground tabular-nums'>
                {evaluation.obtainedMarks} / {evaluation.totalMarks}
              </span>{' '}
              marks. The pass mark is {evaluation.passingPercentage}%.
            </p>
            <dl className='grid w-full grid-cols-3 gap-3 sm:max-w-md'>
              <div className='rounded-lg bg-muted/50 p-3'>
                <dt className='text-xs text-muted-foreground'>Correct</dt>
                <dd className='font-heading text-lg font-semibold tabular-nums'>
                  {correct}/{evaluation.questionResults.length}
                </dd>
              </div>
              <div className='rounded-lg bg-muted/50 p-3'>
                <dt className='text-xs text-muted-foreground'>Time taken</dt>
                <dd className='font-heading text-lg font-semibold tabular-nums'>{attempt ? formatTimeTaken(attempt) : '-'}</dd>
              </div>
              <div className='rounded-lg bg-muted/50 p-3'>
                <dt className='text-xs text-muted-foreground'>Scored</dt>
                <dd className='text-sm font-medium'>{formatDateTime(evaluation.evaluatedAt)}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <ResultActions assessment={assessment} evaluated />

      <Card>
        <CardHeader className='flex flex-row flex-wrap items-center justify-between gap-3'>
          <div>
            <CardTitle>Question breakdown</CardTitle>
            <CardDescription>Correct answers aren&apos;t revealed, so the assessment stays fair for retakes.</CardDescription>
          </div>
          <div role='tablist' aria-label='Filter questions' className='flex gap-1 rounded-lg bg-muted p-1'>
            {(['all', 'correct', 'incorrect'] as const).map((f) => (
              <button
                key={f}
                type='button'
                role='tab'
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                  filter === f ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className='py-6 text-center text-sm text-muted-foreground'>No questions in this view.</p>
          ) : (
            <ol className='flex flex-col divide-y divide-border/60'>
              {rows.map((r) => (
                <li key={r.questionId} className='flex gap-3 py-4 first:pt-0 last:pb-0'>
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full',
                      r.isCorrect ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive',
                    )}
                    aria-label={r.isCorrect ? 'Correct' : 'Incorrect'}
                  >
                    {r.isCorrect ? <Check className='size-4' /> : <X className='size-4' />}
                  </span>
                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <p className='text-sm font-medium break-words whitespace-pre-line'>
                      <span className='text-muted-foreground tabular-nums'>Q{r.number}. </span>
                      {r.question}
                    </p>
                    <p className='text-sm break-words text-muted-foreground'>
                      Your answer: {optionText(r.questionId, r.selectedAnswer) ?? 'No answer'}
                    </p>
                  </div>
                  <span className='shrink-0 text-sm font-medium tabular-nums'>
                    {r.obtainedMarks}/{r.marks}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </>
  );
};

// No cached breakdown (another device, cleared storage): show what the attempt history knows.
const SummaryResult = ({ assessmentId, attemptId }: { assessmentId: string; attemptId: string }) => {
  const now = useNow();
  const { data, error, isPending, refetch } = useGetAssessmentAttempts(assessmentId, { limit: 100 });

  if (isPending) return <Skeleton className='h-56 rounded-xl' />;
  if (!data) {
    if (error instanceof FetchError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <Card className='items-center gap-3 px-4 py-12 text-center'>
        <p className='text-sm text-muted-foreground'>We couldn&apos;t load this result.</p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </Card>
    );
  }

  const { assessment, attempts } = data.data;
  const attempt = attempts.find((a) => a.id === attemptId);

  if (!attempt) {
    return (
      <Card className='items-center gap-3 px-4 py-12 text-center'>
        <p className='text-sm text-muted-foreground'>This attempt doesn&apos;t exist or belongs to another account.</p>
        <ResultActions assessment={assessment} evaluated={false} />
      </Card>
    );
  }

  const evaluated = attempt.status === 'EVALUATED';
  const resumable = isResumable(attempt, now);

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <AttemptStatusBadge attempt={attempt} now={now} />
            <span className='text-sm text-muted-foreground'>Started {formatDateTime(attempt.startedAt)}</span>
          </div>
          {evaluated ? (
            <dl className='grid gap-3 sm:grid-cols-3'>
              <div className='rounded-lg bg-muted/50 p-3'>
                <dt className='text-xs text-muted-foreground'>Score</dt>
                <dd className='font-heading text-lg font-semibold tabular-nums'>{attempt.score ?? 0} marks</dd>
              </div>
              <div className='rounded-lg bg-muted/50 p-3'>
                <dt className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <Clock className='size-3.5' aria-hidden /> Time taken
                </dt>
                <dd className='font-heading text-lg font-semibold tabular-nums'>{formatTimeTaken(attempt)}</dd>
              </div>
              <div className='rounded-lg bg-muted/50 p-3'>
                <dt className='text-xs text-muted-foreground'>Pass mark</dt>
                <dd className='font-heading text-lg font-semibold tabular-nums'>{assessment.passingPercentage}%</dd>
              </div>
            </dl>
          ) : resumable ? (
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <p className='flex-1 text-sm text-muted-foreground'>This attempt is still running.</p>
              <Button nativeButton={false} render={<Link href={examHref(assessmentId, attempt.id)} />}>
                <Play /> Resume attempt
              </Button>
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>
              Time ran out before this attempt was submitted, so it was never scored.
            </p>
          )}
          {evaluated && (
            <p className='flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground'>
              <Info className='mt-0.5 size-3.5 shrink-0' aria-hidden />
              The per-question breakdown is only kept on the device where you took this attempt.
            </p>
          )}
        </CardContent>
      </Card>
      <ResultActions assessment={assessment} evaluated={evaluated} />
    </>
  );
};

const AttemptResultView = ({ assessmentId, attemptId }: { assessmentId: string; attemptId: string }) => {
  const stored = useStoredJson<StoredResult>(resultKey(attemptId));
  // Guard against a cache entry written for a different assessment id in the URL.
  const result = stored?.assessment.id === assessmentId ? stored : null;

  return (
    <div className='flex flex-col gap-6'>
      <BackLink assessmentId={assessmentId} />
      <PageHeader title={result ? result.assessment.title : 'Attempt result'} description='How your attempt went.' />
      {result ? <FullResult result={result} /> : <SummaryResult assessmentId={assessmentId} attemptId={attemptId} />}
    </div>
  );
};

export default AttemptResultView;
