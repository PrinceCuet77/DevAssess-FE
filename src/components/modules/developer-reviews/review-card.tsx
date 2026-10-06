import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Stars } from '@/components/modules/developer-assessments/assessment-reviews-panel';
import { formatDateTime } from '@/components/modules/admin-purchases/purchase-utils';
import AssessmentThumbnail from '@/components/modules/evaluator-purchases/assessment-thumbnail';
import DeleteReviewDialog from '@/components/modules/developer-reviews/delete-review-dialog';
import ReviewFormDialog from '@/components/modules/developer-reviews/review-form-dialog';
import ReviewDetailDialog from '@/components/modules/developer-reviews/review-detail-dialog';
import { RATING_LABELS } from '@/components/modules/developer-reviews/review-utils';
import { Card } from '@/components/ui/card';
import type { DeveloperReview } from '@/types/developer-assessments.types';

const ReviewCard = ({ review }: { review: DeveloperReview }) => {
  const edited = review.updatedAt !== review.createdAt;

  return (
    <Card className='gap-4 p-4 transition-shadow hover:shadow-md'>
      <div className='flex items-start gap-3'>
        <AssessmentThumbnail src={review.assessment.thumbnailUrl} className='size-12' />
        <div className='min-w-0 flex-1'>
          <Link
            href={`/developer/assessments/detail?id=${review.assessment.id}`}
            className='block truncate rounded text-sm font-semibold outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50'
            title={review.assessment.title}
          >
            {review.assessment.title}
          </Link>
          <p className='mt-0.5 flex items-center gap-1 text-xs text-muted-foreground'>
            <Clock className='size-3' aria-hidden />
            {review.assessment.duration} min
          </p>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Stars rating={review.rating} />
        <span className='text-sm font-medium'>{RATING_LABELS[review.rating] ?? ''}</span>
      </div>

      {review.comment ? (
        <p className='line-clamp-4 text-sm leading-relaxed text-muted-foreground'>{review.comment}</p>
      ) : (
        <p className='text-sm text-muted-foreground/70 italic'>No written comment.</p>
      )}

      <div className='mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3'>
        <p className='text-xs text-muted-foreground'>
          {edited ? 'Edited' : 'Reviewed'} {formatDateTime(edited ? review.updatedAt : review.createdAt)}
        </p>
        <div className='flex items-center'>
          <ReviewDetailDialog reviewId={review.id} />
          <ReviewFormDialog
            mode='edit'
            reviewId={review.id}
            assessmentTitle={review.assessment.title}
            rating={review.rating}
            comment={review.comment}
          />
          <DeleteReviewDialog reviewId={review.id} assessmentTitle={review.assessment.title} />
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;
