import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AssessmentReview } from '@/types/developer-assessments.types';

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
const reviewerName = (r: AssessmentReview) => r.developer.name ?? 'Anonymous';

const AssessmentReviewsPanel = ({ reviews }: { reviews: AssessmentReview[] }) => {
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-6'>
        {reviews.length === 0 ? (
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
              {reviews.map((r) => (
                <li key={r.id} className='flex flex-col gap-1.5 py-4 last:pb-0'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-sm font-medium'>{reviewerName(r)}</span>
                    <Stars rating={r.rating} />
                  </div>
                  {r.comment && <p className='text-sm text-muted-foreground'>{r.comment}</p>}
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentReviewsPanel;
