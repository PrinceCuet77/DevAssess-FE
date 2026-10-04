import { FileQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AttemptStatus, DeveloperRecentAttempt } from '@/types/developer-dashboard.types';

const STATUS_LABEL: Record<AttemptStatus, string> = {
  IDLE: 'Not started',
  IN_PROGRESS: 'In progress',
  SUBMITTED: 'Submitted',
  EVALUATED: 'Evaluated',
  EXPIRED: 'Expired',
};

const AttemptBadge = ({ attempt }: { attempt: DeveloperRecentAttempt }) => {
  if (attempt.status === 'EVALUATED') {
    return (
      <Badge variant={attempt.isPassed ? 'success' : 'destructive'}>
        {attempt.isPassed ? 'Passed' : 'Failed'}
      </Badge>
    );
  }
  return <Badge variant='warning'>{STATUS_LABEL[attempt.status]}</Badge>;
};

const RecentAttempts = ({ attempts }: { attempts: DeveloperRecentAttempt[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent attempts</CardTitle>
      <CardDescription>Your latest assessment attempts.</CardDescription>
    </CardHeader>
    <CardContent>
      {attempts.length === 0 ? (
        <p className='py-6 text-center text-sm text-muted-foreground'>No attempts yet.</p>
      ) : (
        <ul className='flex flex-col divide-y divide-border/60'>
          {attempts.map((attempt) => (
            <li key={attempt.id} className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
                <FileQuestion className='size-4' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{attempt.assessment.title}</p>
                <p className='text-xs text-muted-foreground'>
                  {new Date(attempt.createdAt).toLocaleDateString()}
                  {attempt.score !== null && ` · Score: ${attempt.score}`}
                </p>
              </div>
              <AttemptBadge attempt={attempt} />
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentAttempts;
