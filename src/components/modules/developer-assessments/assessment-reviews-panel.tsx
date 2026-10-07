'use client';

import { Star } from 'lucide-react';
import DeleteReviewDialog from '@/components/modules/developer-reviews/delete-review-dialog';
import ReviewFormDialog from '@/components/modules/developer-reviews/review-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAssessmentReviews } from '@/hooks';
import { cn } from '@/lib/utils';
import type { CatalogReviewRow } from '@/types/assessment.types';
import type { DeveloperReview } from '@/types/developer-assessments.types';

export const Stars = ({ rating, className }: { rating: number; className?: string }) => (
  <span className='flex items-center gap-0.5' role='img' aria-label={`${rating.toFixed(1)} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          'size-4',
          i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
          className,
        )}
      />
    ))}
  </span>
);

// Reviewer emails come back from the API; never show them publicly.
const reviewerName = (r: { developer: { name: string | null } }) => r.developer.name ?? 'Anonymous';

type PanelProps = {
  assessmentId: string;
  assessmentTitle: string;
  // From the developer's own review list; the catalog's embedded reviews still include deleted ones.
  myReview?: DeveloperReview | null;
  canReview?: boolean;
};

const AssessmentReviewsPanel = ({ assessmentId, assessmentTitle, myReview, canReview }: PanelProps) => {
  const { data, isPending, isError, refetch } = useGetAssessmentReviews(assessmentId, {
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 100,
  });
  const all = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.meta?.total ?? all.length;
  const isMine = (r: CatalogReviewRow) => r.id === myReview?.id;
  // Pin the viewer's own review to the top.
  const reviews = [...all].sort((a, b) => Number(isMine(b)) - Number(isMine(a)));
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews{data ? ` (${total})` : ''}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-6'>
        {canReview && (
          <div className='flex items-center justify-between gap-3 rounded-lg border border-dashed p-3'>
            <p className='text-sm text-muted-foreground'>You&apos;ve completed this assessment. Share your feedback.</p>
            <ReviewFormDialog mode='create' assessmentId={assessmentId} assessmentTitle={assessmentTitle} />
          </div>
        )}
        {isPending ? (
          <Skeleton className='h-40 rounded-lg' />
        ) : isError ? (
          <div className='flex flex-col items-center gap-3 py-6 text-center'>
            <p className='text-sm text-muted-foreground'>We couldn&apos;t load reviews for this assessment.</p>
            <Button variant='outline' onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : reviews.length === 0 ? (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            No reviews yet. Finish an attempt to be the first to leave one.
          </p>
        ) : (
          <>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
              <div className='flex flex-col items-center gap-1 sm:w-32'>
                <span className='font-heading text-4xl font-semibold tabular-nums'>{average.toFixed(1)}</span>
                <Stars rating={average} />
                <span className='text-xs text-muted-foreground'>{reviews.length} ratings</span>
              </div>
              <ul className='flex flex-1 flex-col gap-1.5'>
                {counts.map(({ star, count }) => (
                  <li key={star} className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <span className='w-3 tabular-nums'>{star}</span>
                    <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-muted'>
                      <div className='h-full rounded-full bg-amber-400' style={{ width: `${(count / reviews.length) * 100}%` }} />
                    </div>
                    <span className='w-6 text-right tabular-nums'>{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className='divide-y divide-border/60 border-t border-border/60'>
              {reviews.map((r) => {
                const mine = isMine(r);
                return (
                  <li
                    key={r.id}
                    className={cn(
                      'flex flex-col gap-1.5 py-4 last:pb-0',
                      mine && 'my-2 rounded-lg border border-primary/40 bg-primary/5 px-4 last:pb-4',
                    )}
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <span className='flex items-center gap-2 text-sm font-medium'>
                        {reviewerName(r)}
                        {mine && <Badge variant='secondary'>Your review</Badge>}
                      </span>
                      <Stars rating={r.rating} />
                    </div>
                    {r.comment && <p className='text-sm break-words text-muted-foreground'>{r.comment}</p>}
                    {mine && (
                      <div className='flex items-center gap-1 pt-1'>
                        <ReviewFormDialog
                          mode='edit'
                          reviewId={r.id}
                          assessmentTitle={assessmentTitle}
                          rating={r.rating}
                          comment={r.comment}
                        />
                        <DeleteReviewDialog reviewId={r.id} assessmentTitle={assessmentTitle} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentReviewsPanel;
