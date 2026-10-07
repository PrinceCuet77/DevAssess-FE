'use client';

import { useState } from 'react';
import { Loader2, Pencil, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  COMMENT_MAX_CREATE,
  COMMENT_MAX_EDIT,
  RATING_LABELS,
} from '@/components/modules/developer-reviews/review-utils';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReview, useUpdateReview } from '@/hooks';
import { getApiErrorMessage, parseFieldErrors } from '@/lib/errors';
import { cn } from '@/lib/utils';

// The live database keeps a deleted review's (developer, assessment) pair unique, so re-reviewing
// after a delete fails with a generic duplicate-key error; say what actually happened.
const reviewErrorMessage = (err: unknown, isEdit: boolean) => {
  const message = getApiErrorMessage(err, isEdit ? 'Could not update the review.' : 'Could not post the review.');
  return /duplicate key/i.test(message)
    ? 'You reviewed this assessment before and deleted it, so a new review can’t be posted.'
    : message;
};

type Props =
  | { mode: 'create'; assessmentId: string; assessmentTitle: string }
  | { mode: 'edit'; reviewId: string; assessmentTitle: string; rating: number; comment: string | null };

const ReviewFormDialog = (props: Props) => {
  const isEdit = props.mode === 'edit';
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});
  const create = useCreateReview();
  const update = useUpdateReview();
  const isPending = create.isPending || update.isPending;
  const maxLength = isEdit ? COMMENT_MAX_EDIT : COMMENT_MAX_CREATE;

  const onOpenChange = (next: boolean) => {
    if (isPending) return;
    // Every session starts from the saved review (edit) or a blank form (create).
    if (next) {
      setRating(props.mode === 'edit' ? props.rating : 0);
      setComment(props.mode === 'edit' ? (props.comment ?? '') : '');
      setErrors({});
    }
    setOpen(next);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = comment.trim();
    const next: typeof errors = {};
    if (rating < 1) next.rating = 'Pick a rating from 1 to 5.';
    if (!trimmed) next.comment = 'Please write a short comment.';
    else if (trimmed.length > maxLength) next.comment = `Comment must be at most ${maxLength} characters.`;
    setErrors(next);
    if (next.rating || next.comment) return;

    const handlers = {
      onSuccess: () => {
        toast.success(isEdit ? 'Review updated.' : 'Thanks for your review!');
        setOpen(false);
      },
      onError: (err: unknown) => {
        const fields = parseFieldErrors(err);
        if (fields.rating || fields.comment) setErrors({ rating: fields.rating, comment: fields.comment });
        else toast.error(reviewErrorMessage(err, isEdit));
      },
    };

    if (props.mode === 'edit') {
      update.mutate({ reviewId: props.reviewId, payload: { rating, comment: trimmed } }, handlers);
    } else {
      create.mutate({ assessmentId: props.assessmentId, rating, comment: trimmed }, handlers);
    }
  };

  return (
    <>
      {isEdit ? (
        <Button variant='ghost' size='sm' onClick={() => onOpenChange(true)}>
          <Pencil />
          Edit
        </Button>
      ) : (
        <Button variant='outline' onClick={() => onOpenChange(true)}>
          <Star />
          Write a review
        </Button>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-lg'>
          <form onSubmit={onSubmit} className='flex flex-col gap-4' noValidate>
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit your review' : 'Write a review'}</DialogTitle>
              <DialogDescription className='break-words'>{props.assessmentTitle}</DialogDescription>
            </DialogHeader>

            <fieldset className='flex flex-col gap-1.5' disabled={isPending}>
              <Label id='review-rating-label'>
                Rating
              </Label>
              <div role='radiogroup' aria-labelledby='review-rating-label' className='flex items-center gap-1'>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type='button'
                    role='radio'
                    aria-checked={rating === value}
                    aria-label={`${value} star${value > 1 ? 's' : ''}`}
                    onClick={() => setRating(value)}
                    className='rounded p-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
                  >
                    <Star
                      className={cn(
                        'size-7 transition-colors',
                        value <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
                      )}
                    />
                  </button>
                ))}
                <span className='ml-2 text-sm font-medium'>{RATING_LABELS[rating] ?? ''}</span>
              </div>
              {errors.rating && <p className='text-xs text-destructive'>{errors.rating}</p>}
            </fieldset>

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='review-comment'>Comment</Label>
              <Textarea
                id='review-comment'
                value={comment}
                maxLength={maxLength}
                disabled={isPending}
                aria-invalid={Boolean(errors.comment)}
                placeholder='What did you think of this assessment?'
                onChange={(e) => setComment(e.target.value)}
              />
              <div className='flex justify-between gap-2'>
                <p className='text-xs text-destructive'>{errors.comment}</p>
                <p className='text-xs text-muted-foreground tabular-nums'>
                  {comment.length}/{maxLength}
                </p>
              </div>
            </div>

            <DialogFooter>
              <DialogClose render={<Button type='button' variant='outline' disabled={isPending} />}>Cancel</DialogClose>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='animate-spin' />}
                {isEdit ? 'Save changes' : 'Post review'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewFormDialog;
