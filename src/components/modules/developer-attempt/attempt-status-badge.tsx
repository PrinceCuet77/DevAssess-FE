import { Badge } from '@/components/ui/badge';
import { ATTEMPT_STATUS_LABEL, isTimedOut } from '@/components/modules/developer-attempt/attempt-utils';
import type { AssessmentAttempt } from '@/types/developer-assessments.types';
import type { AttemptStatus } from '@/types/developer-dashboard.types';

type BadgeAttempt = Pick<AssessmentAttempt, 'status' | 'isPassed'> & Partial<Pick<AssessmentAttempt, 'endedAt'>>;

// Outcome first: evaluated attempts show pass/fail; unfinished ones past their deadline read as
// expired (the backend never writes EXPIRED itself).
const AttemptStatusBadge = ({ attempt, now }: { attempt: BadgeAttempt; now?: number }) => {
  if (attempt.status === 'EVALUATED') {
    return <Badge variant={attempt.isPassed ? 'success' : 'destructive'}>{attempt.isPassed ? 'Passed' : 'Not passed'}</Badge>;
  }
  const expired =
    attempt.status === 'EXPIRED' ||
    (now !== undefined && attempt.endedAt !== undefined && isTimedOut(attempt as AssessmentAttempt, now));
  if (expired) return <Badge variant='secondary'>Expired · not scored</Badge>;
  const variant: Record<AttemptStatus, 'default' | 'warning' | 'secondary'> = {
    IN_PROGRESS: 'default',
    SUBMITTED: 'warning',
    IDLE: 'secondary',
    EXPIRED: 'secondary',
    EVALUATED: 'secondary',
  };
  return <Badge variant={variant[attempt.status]}>{ATTEMPT_STATUS_LABEL[attempt.status]}</Badge>;
};

export default AttemptStatusBadge;
