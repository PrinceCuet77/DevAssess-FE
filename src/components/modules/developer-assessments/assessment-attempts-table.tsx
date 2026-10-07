'use client';

import { useState } from 'react';
import Link from 'next/link';
import { History, Play, Trophy } from 'lucide-react';
import PaginationBar from '@/components/modules/admin-users/pagination-bar';
import AttemptStatusBadge from '@/components/modules/developer-attempt/attempt-status-badge';
import { examHref, formatTimeTaken, isResumable, msLeft, formatClock, resultHref } from '@/components/modules/developer-attempt/attempt-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
} from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAssessmentAttempts } from '@/hooks';
import { useNow } from '@/hooks/use-now';
import { cn } from '@/lib/utils';
import type { AssessmentAttemptsQuery } from '@/types/developer-assessments.types';

const FILTERS: { value: AssessmentAttemptsQuery['status']; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'EVALUATED', label: 'Scored' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'SUBMITTED', label: 'Submitted' },
];

const formatDateTime = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

type IProps = {
  assessmentId: string;
  // Highest raw score across all attempts, to highlight the best one(s).
  bestScore: number | null;
};

const AssessmentAttemptsTable = ({ assessmentId, bestScore }: IProps) => {
  const now = useNow();
  const [query, setQuery] = useState<AssessmentAttemptsQuery>({ page: 1, limit: 10 });
  const { data, isPending, isError, isFetching, refetch } = useGetAssessmentAttempts(assessmentId, query);

  const attempts = data?.data.attempts ?? [];
  const meta = data?.meta;
  // Attempt numbers only make sense on the unfiltered, newest-first list.
  const numbered = !query.status && meta;

  let body;
  if (isPending) {
    body = <Skeleton className='mx-4 h-40 rounded-lg' />;
  } else if (isError) {
    body = (
      <div className='flex flex-col items-center gap-3 px-4 py-10 text-center'>
        <p className='text-sm text-muted-foreground'>We couldn&apos;t load your attempts.</p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  } else if (attempts.length === 0) {
    body = (
      <div className='flex flex-col items-center gap-2 px-4 py-10 text-center'>
        <span className='flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground'>
          <History className='size-5' aria-hidden />
        </span>
        <p className='text-sm font-medium'>{query.status ? 'No attempts with this status' : 'No attempts yet'}</p>
        <p className='text-sm text-muted-foreground'>Your results will appear here after your first attempt.</p>
      </div>
    );
  } else {
    body = (
      <div className={cn(isFetching && 'opacity-60 transition-opacity')}>
        <DataTable minWidth={720}>
          <DataTableHead>
            <tr>
              {numbered && <DataTableHeadCell>#</DataTableHeadCell>}
              <DataTableHeadCell>Started</DataTableHeadCell>
              <DataTableHeadCell>Time taken</DataTableHeadCell>
              <DataTableHeadCell>Score</DataTableHeadCell>
              <DataTableHeadCell>Result</DataTableHeadCell>
              <DataTableHeadCell className='text-right'>Action</DataTableHeadCell>
            </tr>
          </DataTableHead>
          <DataTableBody>
            {attempts.map((attempt, i) => {
              const isBest = attempt.status === 'EVALUATED' && bestScore !== null && attempt.score === bestScore;
              return (
                <DataTableRow key={attempt.id}>
                  {numbered && (
                    <DataTableCell className='text-muted-foreground tabular-nums'>
                      {meta.total - (meta.page - 1) * meta.limit - i}
                    </DataTableCell>
                  )}
                  <DataTableCell>{formatDateTime(attempt.startedAt)}</DataTableCell>
                  <DataTableCell className='text-muted-foreground tabular-nums'>{formatTimeTaken(attempt)}</DataTableCell>
                  <DataTableCell className='tabular-nums'>
                    {attempt.score === null ? (
                      '-'
                    ) : (
                      <span className='inline-flex items-center gap-1.5'>
                        {attempt.score} marks
                        {isBest && <Trophy className='size-3.5 text-amber-500' aria-label='Best score' />}
                      </span>
                    )}
                  </DataTableCell>
                  <DataTableCell>
                    <AttemptStatusBadge attempt={attempt} now={now} />
                  </DataTableCell>
                  <DataTableCell className='text-right'>
                    {attempt.status === 'EVALUATED' ? (
                      <Button size='xs' variant='outline' nativeButton={false} render={<Link href={resultHref(assessmentId, attempt.id)} />}>
                        View result
                      </Button>
                    ) : isResumable(attempt, now) ? (
                      <Button size='xs' nativeButton={false} render={<Link href={examHref(assessmentId, attempt.id)} />}>
                        <Play /> Resume · {formatClock(msLeft(attempt, now))}
                      </Button>
                    ) : (
                      <span className='text-xs text-muted-foreground'>-</span>
                    )}
                  </DataTableCell>
                </DataTableRow>
              );
            })}
          </DataTableBody>
        </DataTable>
      </div>
    );
  }

  return (
    <Card className='pb-0'>
      <CardHeader className='flex flex-row flex-wrap items-start justify-between gap-3'>
        <div>
          <CardTitle>Your attempts</CardTitle>
          <CardDescription>Every time you started this assessment, newest first. Scores are in marks.</CardDescription>
        </div>
        <div role='tablist' aria-label='Filter attempts' className='flex gap-1 rounded-lg bg-muted p-1'>
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type='button'
              role='tab'
              aria-selected={query.status === f.value}
              onClick={() => setQuery((q) => ({ ...q, status: f.value, page: 1 }))}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                query.status === f.value ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className='px-0'>
        {body}
        {meta && attempts.length > 0 && (
          <PaginationBar
            meta={meta}
            noun={['attempt', 'attempts']}
            onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
            onLimitChange={(limit) => setQuery((q) => ({ ...q, limit, page: 1 }))}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentAttemptsTable;
