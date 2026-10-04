'use client';

import { useState } from 'react';
import { Archive, Loader2, Pencil, Rocket, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useDeleteEvaluatorAssessment, useUpdateEvaluatorAssessmentStatus } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import type {
  EvaluatorAssessmentRow,
  EvaluatorSettableStatus,
} from '@/types/evaluator-assessments.types';

const EvaluatorAssessmentActions = ({ assessment }: { assessment: EvaluatorAssessmentRow }) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const updateStatus = useUpdateEvaluatorAssessmentStatus();
  const remove = useDeleteEvaluatorAssessment();

  // Deleted assessments are read-only: there is no undelete.
  if (assessment.status === 'DELETED') return null;

  const changeStatus = (status: EvaluatorSettableStatus, success: string) =>
    updateStatus.mutate(
      { assessmentId: assessment.id, status },
      {
        onSuccess: () => toast.success(success),
        onError: (error) => toast.error(getApiErrorMessage(error, 'Could not update assessment.')),
      },
    );

  const onDelete = () =>
    remove.mutate(assessment.id, {
      onSuccess: () => {
        toast.success('Assessment deleted.');
        router.replace('/evaluator/assessments');
      },
      onError: (error) => toast.error(getApiErrorMessage(error, 'Could not delete assessment.')),
    });

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Button
        variant='outline'
        nativeButton={false}
        render={<Link href={`/evaluator/assessments/detail/edit?id=${assessment.id}`} />}
      >
        <Pencil /> Edit
      </Button>
      {assessment.status === 'PUBLISHED' ? (
        <Button
          variant='outline'
          disabled={updateStatus.isPending}
          onClick={() => changeStatus('ARCHIVED', 'Assessment archived.')}
        >
          {updateStatus.isPending ? <Loader2 className='animate-spin' /> : <Archive />} Archive
        </Button>
      ) : (
        <Button
          disabled={updateStatus.isPending}
          onClick={() => changeStatus('PUBLISHED', 'Assessment published.')}
        >
          {updateStatus.isPending ? <Loader2 className='animate-spin' /> : <Rocket />} Publish
        </Button>
      )}
      <Button variant='destructive' onClick={() => setConfirmOpen(true)}>
        <Trash2 /> Delete
      </Button>

      <Dialog open={confirmOpen} onOpenChange={(open) => !remove.isPending && setConfirmOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this assessment?</DialogTitle>
            <DialogDescription>
              &ldquo;{assessment.title}&rdquo; will be removed from the marketplace. This can&apos;t
              be undone. Existing purchases stay in the system. To hide it reversibly, archive it
              instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant='outline' disabled={remove.isPending} />}>
              Cancel
            </DialogClose>
            <Button variant='destructive' onClick={onDelete} disabled={remove.isPending}>
              {remove.isPending && <Loader2 className='animate-spin' />}
              Delete assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluatorAssessmentActions;
