import { History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
} from '@/components/ui/data-table';
import type { AssessmentAttempt } from '@/types/developer-assessments.types';
import type { AttemptStatus } from '@/types/developer-dashboard.types';

const STATUS_LABEL: Record<AttemptStatus, string> = {
  IDLE: 'Not started',
  IN_PROGRESS: 'In progress',
  SUBMITTED: 'Submitted',
  EVALUATED: 'Evaluated',
  EXPIRED: 'Expired',
};

const formatDateTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '-';

const OutcomeBadge = ({ attempt }: { attempt: AssessmentAttempt }) => {
  if (attempt.status === 'EVALUATED') {
    return <Badge variant={attempt.isPassed ? 'success' : 'destructive'}>{attempt.isPassed ? 'Passed' : 'Failed'}</Badge>;
  }
  return <Badge variant={attempt.status === 'EXPIRED' ? 'destructive' : 'warning'}>{STATUS_LABEL[attempt.status]}</Badge>;
};

const AssessmentAttemptsTable = ({ attempts }: { attempts: AssessmentAttempt[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Your attempts</CardTitle>
      <CardDescription>Every time you started this assessment, newest first.</CardDescription>
    </CardHeader>
    <CardContent className='px-0'>
      {attempts.length === 0 ? (
        <div className='flex flex-col items-center gap-2 px-4 py-10 text-center'>
          <span className='flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground'>
            <History className='size-5' aria-hidden />
          </span>
          <p className='text-sm font-medium'>No attempts yet</p>
          <p className='text-sm text-muted-foreground'>Your results will appear here after your first attempt.</p>
        </div>
      ) : (
        <DataTable minWidth={640}>
          <DataTableHead>
            <tr>
              <DataTableHeadCell>Started</DataTableHeadCell>
              <DataTableHeadCell>Status</DataTableHeadCell>
              <DataTableHeadCell>Score</DataTableHeadCell>
              <DataTableHeadCell>Result</DataTableHeadCell>
              <DataTableHeadCell>Evaluated</DataTableHeadCell>
            </tr>
          </DataTableHead>
          <DataTableBody>
            {attempts.map((attempt) => (
              <DataTableRow key={attempt.id}>
                <DataTableCell>{formatDateTime(attempt.startedAt)}</DataTableCell>
                <DataTableCell className='text-muted-foreground'>{STATUS_LABEL[attempt.status]}</DataTableCell>
                <DataTableCell className='tabular-nums'>{attempt.score ?? '-'}</DataTableCell>
                <DataTableCell>
                  <OutcomeBadge attempt={attempt} />
                </DataTableCell>
                <DataTableCell className='text-muted-foreground'>{formatDateTime(attempt.evaluatedAt)}</DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      )}
    </CardContent>
  </Card>
);

export default AssessmentAttemptsTable;
