'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { formatDateTime, formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import { RATING_LABELS } from '@/components/modules/developer-reviews/review-utils';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDeveloperReview } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';

const ReviewBody = ({ reviewId }: { reviewId: string }) => {
  const { data: review, isPending, isError, error, refetch } = useGetDeveloperReview(reviewId);

  if (isPending) {
    return (
      <div className='flex flex-col gap-4' aria-busy>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-12 rounded-lg' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-3 w-1/3' />
          </div>
        </div>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-24 w-full' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center gap-3 py-6 text-center'>
        <p className='text-sm text-muted-foreground'>
          {getApiErrorMessage(error, 'We couldn\'t load this review.')}
        </p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const edited = review.updatedAt !== review.createdAt;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start gap-3'>
        <AssessmentThumbnail src={review.assessment.thumbnailUrl} className='size-12' />
        <div className='min-w-0 flex-1'>
          <Link
            href={`/developer/assessments/detail?id=${review.assessment.id}`}
            className='block rounded text-sm font-semibold outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50'
          >
            {review.assessment.title}
          </Link>
          <p className='mt-0.5 flex items-center gap-2 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <Clock className='size-3' aria-hidden />
              {review.assessment.duration} min
            </span>
            <span aria-hidden>·</span>
            <span>{formatMoney(review.assessment.price, 'BDT')}</span>
          </p>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Stars rating={review.rating} className='size-5' />
        <span className='text-sm font-medium'>
          {review.rating}/5 · {RATING_LABELS[review.rating] ?? ''}
        </span>
      </div>

      <div className='max-h-64 overflow-y-auto rounded-lg bg-muted/40 p-3'>
        {review.comment ? (
          <p className='text-sm leading-relaxed break-words whitespace-pre-wrap'>{review.comment}</p>
        ) : (
          <p className='text-sm text-muted-foreground italic'>No written comment.</p>
        )}
      </div>

      <p className='text-xs text-muted-foreground'>
        Posted {formatDateTime(review.createdAt)}
        {edited && ` · Edited ${formatDateTime(review.updatedAt)}`}
      </p>
    </div>
  );
};

const ReviewDetailDialog = ({ reviewId }: { reviewId: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant='ghost' size='sm' onClick={() => setOpen(true)}>
        <Eye />
        View
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Your review</DialogTitle>
            <DialogDescription>The full rating and feedback you shared.</DialogDescription>
          </DialogHeader>
          {/* Mounted only while open, so the single-review request fires on open. */}
          {open && <ReviewBody reviewId={reviewId} />}
          <DialogFooter>
            <DialogClose render={<Button variant='outline' />}>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewDetailDialog;
