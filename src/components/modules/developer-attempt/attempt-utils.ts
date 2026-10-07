import { readJson, removeKey, storageKey, writeJson } from '@/lib/storage';
import type {
  AssessmentAttempt,
  AttemptAssessment,
  AttemptEvaluation,
  AttemptQuestion,
} from '@/types/developer-assessments.types';
import type { AttemptStatus } from '@/types/developer-dashboard.types';

export const ATTEMPT_STATUS_LABEL: Record<AttemptStatus, string> = {
  IDLE: 'Not started',
  IN_PROGRESS: 'In progress',
  SUBMITTED: 'Submitted',
  EVALUATED: 'Evaluated',
  EXPIRED: 'Expired',
};

// Started but never scored. SUBMITTED counts too: `evaluate` still accepts it, e.g. when the
// request after "submit" failed.
export const isUnfinished = (attempt: Pick<AssessmentAttempt, 'status'>) =>
  attempt.status === 'IN_PROGRESS' || attempt.status === 'SUBMITTED';

const deadlineOf = (attempt: Pick<AssessmentAttempt, 'endedAt'>) =>
  attempt.endedAt ? new Date(attempt.endedAt).getTime() : null;

// The server never enforces `endedAt` (and never writes EXPIRED), so the UI decides.
export const msLeft = (attempt: Pick<AssessmentAttempt, 'endedAt'>, now: number) => {
  const deadline = deadlineOf(attempt);
  return deadline === null ? Infinity : deadline - now;
};

export const isResumable = (attempt: AssessmentAttempt, now: number) => isUnfinished(attempt) && msLeft(attempt, now) > 0;

export const isTimedOut = (attempt: AssessmentAttempt, now: number) => isUnfinished(attempt) && msLeft(attempt, now) <= 0;

// The newest unfinished attempt that still has time; older ones always end earlier.
export const findResumable = (attempts: AssessmentAttempt[], now: number) =>
  [...attempts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).find((a) => isResumable(a, now));

export const formatClock = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

export const formatTimeTaken = (attempt: AssessmentAttempt) => {
  const end = attempt.submittedAt ?? attempt.evaluatedAt;
  if (!end) return '-';
  const minutes = Math.max(0, Math.round((new Date(end).getTime() - new Date(attempt.startedAt).getTime()) / 60_000));
  if (minutes < 1) return '< 1 min';
  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

export const takeHref = (assessmentId: string) => `/developer/assessments/detail/take?id=${assessmentId}`;

export const examHref = (assessmentId: string, attemptId: string) =>
  `/developer/assessments/detail/attempt?id=${assessmentId}&attemptId=${attemptId}`;

export const resultHref = (assessmentId: string, attemptId: string) =>
  `/developer/assessments/detail/result?id=${assessmentId}&attemptId=${attemptId}`;

export const attemptsHref = (assessmentId: string) => `/developer/assessments/detail?id=${assessmentId}&tab=attempts`;

// Answers only reach the server with `evaluate`, so the draft lives in localStorage: a refresh,
// a crash or a second tab on this device picks up where the developer left off.
export type AttemptDraft = {
  answers: Record<string, string>; // questionId -> optionId
  flagged: string[];
  current: number;
  // Server time minus device time, measured when the attempt started. Corrects the countdown on a
  // device whose clock is off, since the deadline (`endedAt`) is server time.
  clockSkew?: number;
  updatedAt: string;
};

export const draftKey = (attemptId: string) => storageKey('attempt', attemptId);

export const readDraft = (attemptId: string) => readJson<AttemptDraft>(draftKey(attemptId));

export const writeDraft = (attemptId: string, draft: Omit<AttemptDraft, 'updatedAt'>) =>
  writeJson(draftKey(attemptId), { ...draft, updatedAt: new Date().toISOString() });

export const removeDraft = (attemptId: string) => removeKey(draftKey(attemptId));

// The per-question breakdown can't be fetched again later, so keep it (with the questions, to
// show option text) for the result page.
export type StoredResult = {
  assessment: AttemptAssessment;
  evaluation: AttemptEvaluation;
  questions: AttemptQuestion[];
  attempt?: AssessmentAttempt;
};

export const resultKey = (attemptId: string) => storageKey('result', attemptId);

export const saveResult = (attemptId: string, result: StoredResult) => writeJson(resultKey(attemptId), result);
