import Link from 'next/link';
import { ChevronRight, FileQuestion } from 'lucide-react';
import AttemptStatusBadge from '@/components/modules/developer-attempt/attempt-status-badge';
import { isUnfinished, resultHref, takeHref } from '@/components/modules/developer-attempt/attempt-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DeveloperRecentAttempt } from '@/types/developer-dashboard.types';

// Scored attempts open their result; unfinished ones open the start screen, which offers Resume
// while time is left (this payload has no deadline to decide that here).
const attemptHref = (attempt: DeveloperRecentAttempt) => {
  if (attempt.status === 'EVALUATED') return resultHref(attempt.assessment.id, attempt.id);
  if (isUnfinished(attempt)) return takeHref(attempt.assessment.id);
  return `/developer/assessments/detail?id=${attempt.assessment.id}&tab=attempts`;
};

const RecentAttempts = ({ attempts }: { attempts: DeveloperRecentAttempt[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent attempts</CardTitle>
      <CardDescription>Your latest assessment attempts. Scores are in marks.</CardDescription>
    </CardHeader>
    <CardContent>
      {attempts.length === 0 ? (
        <p className='py-6 text-center text-sm text-muted-foreground'>No attempts yet.</p>
      ) : (
        <ul className='-mx-2 flex flex-col divide-y divide-border/60'>
          {attempts.map((attempt) => (
            <li key={attempt.id}>
              <Link
                href={attemptHref(attempt)}
                className='flex items-center gap-3 rounded-lg px-2 py-3 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50'
              >
                <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
                  <FileQuestion className='size-4' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{attempt.assessment.title}</p>
                  <p className='text-xs text-muted-foreground'>
                    {new Date(attempt.createdAt).toLocaleDateString()}
                    {attempt.score !== null && ` · ${attempt.score} marks`}
                  </p>
                </div>
                <AttemptStatusBadge attempt={attempt} />
                <ChevronRight className='size-4 shrink-0 text-muted-foreground' aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentAttempts;
