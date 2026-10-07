'use client';

import { useState } from 'react';
import { Loader2, MessageSquareText } from 'lucide-react';
import { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import { RATING_LABELS } from '@/components/modules/developer-reviews/review-utils';
import {
  averageRating,
  formatDate,
  formatRelative,
  initials,
  reviewerName,
} from '@/components/modules/public-assessments/catalog-utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAssessmentReviews } from '@/hooks';
import { cn } from '@/lib/utils';
import type { CatalogReview, CatalogReviewRow, CatalogReviewsQuery } from '@/types/assessment.types';

const PAGE_SIZE = 5;

const SORTS = [
  { value: 'createdAt:desc', label: 'Most recent' },
  { value: 'rating:desc', label: 'Highest rated' },
  { value: 'rating:asc', label: 'Lowest rated' },
  { value: 'createdAt:asc', label: 'Oldest' },
];

const SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:[&>option]:bg-background';

// Built from the reviews embedded in the assessment, so it's ready before the list loads.
const RatingSummary = ({ reviews }: { reviews: CatalogReview[] }) => {
  const average = averageRating(reviews) ?? 0;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className='flex flex-col gap-5 rounded-xl bg-muted/40 p-5 sm:flex-row sm:items-center lg:flex-col lg:items-stretch'>
      <div className='flex flex-col items-center gap-1.5 sm:w-36 lg:w-auto'>
        <span className='font-heading text-5xl font-semibold tracking-tight tabular-nums'>{average.toFixed(1)}</span>
        <Stars rating={average} />
        <span className='text-xs text-muted-foreground'>
          {reviews.length} {reviews.length === 1 ? 'rating' : 'ratings'}
        </span>
      </div>
      <ul className='flex flex-1 flex-col gap-2' aria-label='Rating breakdown'>
        {counts.map(({ star, count }) => {
          const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
          return (
            <li key={star} className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span className='w-10 shrink-0 tabular-nums'>{star} star</span>
              <div
                className='h-2 flex-1 overflow-hidden rounded-full bg-muted'
                role='progressbar'
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${star} star reviews`}
              >
                <div className='h-full rounded-full bg-amber-400 transition-[width]' style={{ width: `${pct}%` }} />
              </div>
              <span className='w-8 shrink-0 text-right tabular-nums'>{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ReviewItem = ({ review }: { review: CatalogReviewRow }) => {
  const name = reviewerName(review.developer);
  const edited = review.updatedAt !== review.createdAt;

  return (
    <li className='flex gap-3 py-5 first:pt-0'>
      <span
        aria-hidden
        className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'
      >
        {initials(name)}
      </span>
      <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
        <div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5'>
          <span className='truncate text-sm font-medium'>{name}</span>
          <time
            dateTime={review.createdAt}
            title={formatDate(review.createdAt)}
            className='text-xs text-muted-foreground'
          >
            {formatRelative(review.createdAt)}
            {edited && ' · edited'}
          </time>
        </div>
        <div className='flex items-center gap-2'>
          <Stars rating={review.rating} className='size-3.5' />
          <span className='text-xs font-medium text-muted-foreground'>{RATING_LABELS[review.rating] ?? ''}</span>
        </div>
        {review.comment ? (
          <p className='text-sm leading-relaxed break-words whitespace-pre-line text-foreground/90'>{review.comment}</p>
        ) : (
          <p className='text-sm text-muted-foreground/70 italic'>Rated without a written comment.</p>
        )}
      </div>
    </li>
  );
};

const ListSkeleton = () => (
  <ul className='flex flex-col gap-6' aria-busy aria-label='Loading reviews'>
    {Array.from({ length: 3 }, (_, i) => (
      <li key={i} className='flex gap-3'>
        <Skeleton className='size-9 rounded-full' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-2/3' />
        </div>
      </li>
    ))}
  </ul>
);

type IProps = {
  assessmentId: string;
  embeddedReviews: CatalogReview[];
};

const PublicReviewsSection = ({ assessmentId, embeddedReviews }: IProps) => {
  const [sort, setSort] = useState('createdAt:desc');
  const [sortBy, sortOrder] = sort.split(':') as [CatalogReviewsQuery['sortBy'], CatalogReviewsQuery['sortOrder']];
  const reviewsQuery = useGetAssessmentReviews(assessmentId, { sortBy, sortOrder, limit: PAGE_SIZE });
  const { data, isPending, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isPlaceholderData } =
    reviewsQuery;

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.meta?.total ?? embeddedReviews.length;

  return (
    <section aria-labelledby='reviews-heading' className='flex scroll-mt-24 flex-col gap-6' id='reviews'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h2 id='reviews-heading' className='font-heading text-xl font-semibold tracking-tight'>
            Developer reviews
          </h2>
          <p className='text-sm text-muted-foreground'>Honest feedback from developers who completed it.</p>
        </div>
        {total > 1 && (
          <select
            aria-label='Sort reviews'
            className={SELECT_CLASS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {embeddedReviews.length === 0 && total === 0 ? (
        <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-12 text-center'>
          <div className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
            <MessageSquareText className='size-6' />
          </div>
          <div className='flex flex-col gap-1'>
            <h3 className='text-sm font-semibold'>No reviews yet</h3>
            <p className='max-w-sm text-sm text-muted-foreground'>
              Developers can leave a review after completing this assessment. Be the first to share how it went.
            </p>
          </div>
        </div>
      ) : (
        <div className='grid items-start gap-8 lg:grid-cols-[15rem_1fr]'>
          <RatingSummary reviews={embeddedReviews} />

          <div className='flex min-w-0 flex-col gap-4'>
            {isPending ? (
              <ListSkeleton />
            ) : isError ? (
              <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-10 text-center'>
                <p className='text-sm text-muted-foreground'>We couldn&apos;t load reviews.</p>
                <Button variant='outline' onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <ul
                  className={cn(
                    'divide-y divide-border/60',
                    isPlaceholderData && 'opacity-60 transition-opacity',
                  )}
                >
                  {reviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </ul>
                {hasNextPage && (
                  <Button
                    variant='outline'
                    className='self-center'
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                  >
                    {isFetchingNextPage && <Loader2 className='animate-spin' />}
                    Show more reviews
                    <span className='text-muted-foreground tabular-nums'>
                      ({reviews.length} of {total})
                    </span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PublicReviewsSection;
