'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FetchError } from 'ofetch';
import { AlertTriangle, ArrowLeft, Clock, Loader2, RotateCcw, Send, TimerOff } from 'lucide-react';
import { toast } from 'sonner';
import {
  attemptsHref,
  formatClock,
  msLeft,
  readDraft,
  removeDraft,
  resultHref,
  saveResult,
  takeHref,
  writeDraft,
} from '@/components/modules/developer-attempt/attempt-utils';
import ExamNavigator from '@/components/modules/developer-attempt/exam-navigator';
import ExamQuestion from '@/components/modules/developer-attempt/exam-question';
import FinishDialog from '@/components/modules/developer-attempt/finish-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvaluateAttempt, useGetAttempt, useSubmitAttempt } from '@/hooks';
import { useNow } from '@/hooks/use-now';
import { getApiErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/utils';
import type { AttemptDetail } from '@/types/developer-assessments.types';

const FIVE_MINUTES = 5 * 60_000;
const ONE_MINUTE = 60_000;

const StateCard = ({ title, children, actions }: { title: string; children: React.ReactNode; actions: React.ReactNode }) => (
  <Card className='mx-auto w-full max-w-xl items-center gap-3 px-6 py-12 text-center'>
    <h2 className='font-heading text-lg font-semibold'>{title}</h2>
    <p className='max-w-md text-sm text-muted-foreground'>{children}</p>
    <div className='flex flex-wrap justify-center gap-2 pt-2'>{actions}</div>
  </Card>
);

const backToAssessment = (assessmentId: string) => (
  <Button variant='outline' nativeButton={false} render={<Link href={`/developer/assessments/detail?id=${assessmentId}`} />}>
    <ArrowLeft /> Back to assessment
  </Button>
);

const Timer = ({ left }: { left: number }) => {
  const tone = left <= ONE_MINUTE ? 'danger' : left <= FIVE_MINUTES ? 'warning' : 'normal';
  return (
    <span
      role='timer'
      aria-label={`Time left ${formatClock(left)}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-sm font-semibold tabular-nums',
        tone === 'normal' && 'bg-muted text-foreground',
        tone === 'warning' && 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
        tone === 'danger' && 'animate-pulse bg-destructive/15 text-destructive',
      )}
    >
      <Clock className='size-4' aria-hidden />
      {formatClock(left)}
    </span>
  );
};

type SessionProps = AttemptDetail;

// Owns the answer state for one attempt. Mounted only once the questions are loaded, so the
// local draft can seed the initial state directly.
const ExamSession = ({ assessment, attempt, questions }: SessionProps) => {
  const router = useRouter();
  const now = useNow();
  const submit = useSubmitAttempt();
  const evaluate = useEvaluateAttempt();

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    // Drop anything that no longer matches the questions (e.g. the evaluator edited them).
    const saved = readDraft(attempt.id)?.answers ?? {};
    return Object.fromEntries(
      Object.entries(saved).filter(([qid, optionId]) =>
        questions.some((q) => q.id === qid && q.options.some((o) => o.id === optionId)),
      ),
    );
  });
  const [flagged, setFlagged] = useState<string[]>(() => readDraft(attempt.id)?.flagged ?? []);
  const [current, setCurrent] = useState(() => Math.min(readDraft(attempt.id)?.current ?? 0, questions.length - 1));
  // Without a draft (another device) we can only trust the local clock.
  const [clockSkew] = useState(() => readDraft(attempt.id)?.clockSkew ?? 0);
  const [finishOpen, setFinishOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  // A terminal problem (assessment removed, attempt gone): stop accepting input.
  const [blocked, setBlocked] = useState<string | null>(null);
  // Scored and on the way to the result page.
  const [done, setDone] = useState(false);

  const left = msLeft(attempt, now + clockSkew);
  const timeUp = left <= 0;
  const unanswered = questions.flatMap((q, i) => (answers[q.id] ? [] : [i]));
  const complete = unanswered.length === 0;
  const locked = timeUp || finishing || Boolean(blocked) || done;
  const question = questions[current];

  const persist = (patch: { answers?: Record<string, string>; flagged?: string[]; current?: number }) =>
    writeDraft(attempt.id, { answers, flagged, current, clockSkew, ...patch });

  const select = (optionId: string) => {
    if (locked) return;
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    persist({ answers: next });
  };

  const toggleFlag = () => {
    const next = flagged.includes(question.id) ? flagged.filter((id) => id !== question.id) : [...flagged, question.id];
    setFlagged(next);
    persist({ flagged: next });
  };

  const jump = (index: number) => {
    const next = Math.max(0, Math.min(index, questions.length - 1));
    setCurrent(next);
    persist({ current: next });
  };

  const handleFinishError = (err: unknown) => {
    const message = getApiErrorMessage(err, 'Something went wrong while scoring your attempt.');
    if (!(err instanceof FetchError) || err.status === undefined) {
      setFinishError('We couldn’t reach the server. Your answers are saved on this device, so you can safely try again.');
    } else if (err.status === 400 && /already been evaluated/i.test(message)) {
      // Scored from another tab or a request that timed out on our side but succeeded on the server.
      setDone(true);
      removeDraft(attempt.id);
      toast.info('This attempt has already been scored.');
      router.replace(resultHref(assessment.id, attempt.id));
    } else if (err.status === 400 && /answer every question/i.test(message)) {
      if (unanswered.length) jump(unanswered[0]);
      setFinishError(message);
    } else if (err.status === 404 && /assessment/i.test(message)) {
      setBlocked('This assessment is no longer available, so your attempt can’t be scored. Your answers stay saved on this device.');
    } else if (err.status === 404 || err.status === 403) {
      setBlocked(message);
    } else {
      setFinishError(message);
    }
  };

  const finish = async () => {
    if (finishing || done || blocked) return;
    if (!complete) {
      setFinishOpen(true);
      return;
    }
    setFinishing(true);
    setFinishError(null);
    try {
      // `submit` only stamps `submittedAt`; skip it on a retry after it already went through.
      if (attempt.status === 'IN_PROGRESS') {
        await submit.mutateAsync({ assessmentId: assessment.id, attemptId: attempt.id });
      }
      const { data } = await evaluate.mutateAsync({
        assessmentId: assessment.id,
        attemptId: attempt.id,
        answers: questions.map((q) => ({ questionId: q.id, answer: answers[q.id] })),
      });
      setDone(true);
      saveResult(attempt.id, {
        assessment: data.assessment,
        evaluation: data.evaluation,
        questions,
        attempt: data.attemptHistory.find((a) => a.id === attempt.id),
      });
      removeDraft(attempt.id);
      router.replace(resultHref(assessment.id, attempt.id));
    } catch (err) {
      setFinishing(false);
      handleFinishError(err);
    }
  };

  // The server doesn't enforce the deadline, so the UI does: at zero, lock the inputs and submit
  // automatically if everything is answered. A partial attempt can't be scored by the API.
  const onTimeUp = useEffectEvent(() => {
    if (complete) {
      toast.info('Time’s up. Submitting your answers…');
      finish();
    }
  });
  useEffect(() => {
    const ms = msLeft(attempt, Date.now() + clockSkew);
    if (!Number.isFinite(ms)) return;
    const timer = setTimeout(onTimeUp, Math.min(Math.max(ms, 0), 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [attempt, clockSkew]);

  const warn = useEffectEvent((message: string) => {
    if (!timeUp) toast.warning(message);
  });
  const underFive = left <= FIVE_MINUTES;
  const underOne = left <= ONE_MINUTE;
  useEffect(() => {
    if (underFive && !underOne) warn('5 minutes left.');
  }, [underFive, underOne]);
  useEffect(() => {
    if (underOne) warn('Less than a minute left.');
  }, [underOne]);

  // Answers are saved locally, but the timer keeps running if the tab is closed.
  useEffect(() => {
    if (locked) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [locked]);

  const answeredCount = questions.length - unanswered.length;

  return (
    <div className='flex flex-col gap-4'>
      <div className='sticky top-16 z-30 -mx-4 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <div className='flex min-w-0 flex-1 flex-col'>
            <h1 className='truncate font-heading text-base font-semibold sm:text-lg'>{assessment.title}</h1>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <div
                className='h-1.5 w-24 overflow-hidden rounded-full bg-muted sm:w-40'
                role='progressbar'
                aria-label='Questions answered'
                aria-valuenow={answeredCount}
                aria-valuemin={0}
                aria-valuemax={questions.length}
              >
                <div
                  className='h-full rounded-full bg-primary transition-[width]'
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
              <span className='tabular-nums'>
                {answeredCount}/{questions.length} answered
              </span>
            </div>
          </div>
          <Timer left={left} />
          <Button onClick={() => setFinishOpen(true)} disabled={locked}>
            {finishing ? <Loader2 className='animate-spin' /> : <Send />}
            {finishing ? 'Scoring…' : 'Finish'}
          </Button>
        </div>
      </div>

      {blocked && (
        <div role='alert' className='flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm'>
          <AlertTriangle className='mt-0.5 size-4 shrink-0 text-destructive' aria-hidden />
          <div className='flex flex-col gap-2'>
            <p>{blocked}</p>
            <Link href={attemptsHref(assessment.id)} className='w-fit font-medium underline'>
              Go to your attempts
            </Link>
          </div>
        </div>
      )}

      {timeUp && !blocked && !done && (
        <div role='alert' className='flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm sm:flex-row sm:items-center'>
          <TimerOff className='size-5 shrink-0 text-amber-600 dark:text-amber-400' aria-hidden />
          <p className='flex-1'>
            {complete
              ? finishing
                ? 'Time’s up. Submitting your answers…'
                : 'Time’s up. Your answers are complete, submit them to get your score.'
              : `Time’s up. You answered ${answeredCount} of ${questions.length} questions, and an attempt can only be scored when every question is answered. This attempt won’t be scored.`}
          </p>
          <div className='flex shrink-0 gap-2'>
            {complete ? (
              <Button onClick={finish} disabled={finishing}>
                {finishing ? <Loader2 className='animate-spin' /> : <Send />}
                Submit answers
              </Button>
            ) : (
              <Button nativeButton={false} render={<Link href={takeHref(assessment.id)} />}>
                <RotateCcw /> Start a new attempt
              </Button>
            )}
          </div>
        </div>
      )}

      {finishError && !blocked && (
        <div role='alert' className='flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm sm:flex-row sm:items-center'>
          <AlertTriangle className='size-4 shrink-0 text-destructive' aria-hidden />
          <p className='flex-1'>{finishError}</p>
          {complete && (
            <Button variant='outline' onClick={finish} disabled={finishing}>
              {finishing && <Loader2 className='animate-spin' />}
              Try again
            </Button>
          )}
        </div>
      )}

      <div className='grid items-start gap-4 lg:grid-cols-[1fr_18rem]'>
        <ExamQuestion
          question={question}
          index={current}
          total={questions.length}
          selected={answers[question.id]}
          flagged={flagged.includes(question.id)}
          locked={locked}
          onSelect={select}
          onToggleFlag={toggleFlag}
          onPrev={() => jump(current - 1)}
          onNext={() => jump(current + 1)}
        />
        <div className='lg:sticky lg:top-40'>
          <ExamNavigator questions={questions} answers={answers} flagged={flagged} current={current} onJump={jump} />
        </div>
      </div>

      <FinishDialog
        open={finishOpen}
        onOpenChange={setFinishOpen}
        total={questions.length}
        unanswered={unanswered}
        flaggedCount={flagged.filter((id) => answers[id]).length}
        finishing={finishing}
        onJump={jump}
        onConfirm={() => {
          setFinishOpen(false);
          finish();
        }}
      />
    </div>
  );
};

const AttemptExamView = ({ assessmentId, attemptId }: { assessmentId: string; attemptId: string }) => {
  const { data, error, isPending, refetch } = useGetAttempt(assessmentId, attemptId);

  if (isPending) {
    return (
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-14 w-full rounded-lg' />
        <div className='grid gap-4 lg:grid-cols-[1fr_18rem]'>
          <Skeleton className='h-96 rounded-xl' />
          <Skeleton className='h-64 rounded-xl' />
        </div>
      </div>
    );
  }

  if (!data) {
    const status = error instanceof FetchError ? error.status : undefined;
    // An unknown route (not an unknown attempt) means the API predates the exam endpoints.
    if (status === 404 && (error as FetchError).data?.message === 'Route not found') {
      return (
        <StateCard title='Exam unavailable' actions={backToAssessment(assessmentId)}>
          The server can&apos;t send the questions for this attempt yet. Please try again later.
        </StateCard>
      );
    }
    if (status === 404 || status === 400) {
      return (
        <StateCard title='Attempt not found' actions={backToAssessment(assessmentId)}>
          This attempt doesn&apos;t exist or belongs to another account.
        </StateCard>
      );
    }
    if (status === 403) {
      return (
        <StateCard
          title='Purchase required'
          actions={
            <Button nativeButton={false} render={<Link href={`/assessments/detail?id=${assessmentId}`} />}>
              View purchase options
            </Button>
          }
        >
          {getApiErrorMessage(error, 'You must purchase this assessment before you can access it.')}
        </StateCard>
      );
    }
    return (
      <StateCard
        title='We couldn’t load your attempt'
        actions={
          <Button variant='outline' onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        Your answers are saved on this device. Check your connection and try again.
      </StateCard>
    );
  }

  if (data.attempt.status === 'EVALUATED') {
    return (
      <StateCard
        title='This attempt is already scored'
        actions={
          <>
            <Button nativeButton={false} render={<Link href={resultHref(assessmentId, attemptId)} />}>
              View result
            </Button>
            {backToAssessment(assessmentId)}
          </>
        }
      >
        Answers can&apos;t be changed after scoring. Start a new attempt to try again.
      </StateCard>
    );
  }

  if (data.questions.length === 0) {
    return (
      <StateCard title='No questions yet' actions={backToAssessment(assessmentId)}>
        This assessment doesn&apos;t have any questions, so it can&apos;t be taken right now.
      </StateCard>
    );
  }

  return <ExamSession key={attemptId} {...data} />;
};

export default AttemptExamView;
