'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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
import { useDeleteReview } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';

const DeleteReviewDialog = ({ reviewId, assessmentTitle }: { reviewId: string; assessmentTitle: string }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteReview();

  const onConfirm = () =>
    mutate(reviewId, {
      onSuccess: () => {
        toast.success('Review deleted.');
        setOpen(false);
      },
      onError: (err) => toast.error(getApiErrorMessage(err, 'Could not delete the review.')),
    });

  return (
    <>
      <Button variant='ghost' size='sm' className='text-destructive hover:text-destructive' onClick={() => setOpen(true)}>
        <Trash2 />
        Delete
      </Button>
      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete this review?</DialogTitle>
            <DialogDescription className='break-words'>
              Your review of &ldquo;{assessmentTitle}&rdquo; will be removed. You may not be able to post a new review for
              this assessment afterwards, so consider editing it instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant='outline' disabled={isPending} />}>Cancel</DialogClose>
            <Button variant='destructive' onClick={onConfirm} disabled={isPending}>
              {isPending && <Loader2 className='animate-spin' />}
              Delete review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteReviewDialog;
