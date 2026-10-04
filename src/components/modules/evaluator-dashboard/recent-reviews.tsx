import { Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { EvaluatorRecentReview } from '@/types/evaluator-dashboard.types';

const RecentReviews = ({ reviews }: { reviews: EvaluatorRecentReview[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent reviews</CardTitle>
      <CardDescription>What developers say about your assessments.</CardDescription>
    </CardHeader>
    <CardContent>
      {reviews.length === 0 ? (
        <p className='py-6 text-center text-sm text-muted-foreground'>No reviews yet.</p>
      ) : (
        <ul className='flex flex-col divide-y divide-border/60'>
          {reviews.map((review) => (
            <li key={review.id} className='flex flex-col gap-1 py-3 first:pt-0 last:pb-0'>
              <div className='flex items-center justify-between gap-3'>
                <p className='truncate text-sm font-medium'>{review.assessment.title}</p>
                <div className='flex shrink-0 items-center gap-0.5' aria-label={`${review.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className='line-clamp-2 text-sm text-muted-foreground'>{review.comment}</p>
              )}
              <p className='text-xs text-muted-foreground'>
                {review.developer.name ?? review.developer.email} ·{' '}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentReviews;
