'use client';

import { useState } from 'react';
import { Archive, Eye, FileEdit, Loader2, MoreHorizontal, Pencil, Rocket, Trash2 } from 'lucide-react';
import Link from 'next/link';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteEvaluatorAssessment, useUpdateEvaluatorAssessmentStatus } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import type {
  EvaluatorAssessmentRow,
  EvaluatorSettableStatus,
} from '@/types/evaluator-assessments.types';

const AssessmentRowActions = ({ assessment }: { assessment: EvaluatorAssessmentRow }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const updateStatus = useUpdateEvaluatorAssessmentStatus();
  const remove = useDeleteEvaluatorAssessment();

  // Deleted rows are read-only: PATCH would still succeed server-side, but there is no undelete.
  if (assessment.status === 'DELETED') {
    return (
      <Button
        variant='ghost'
        size='sm'
        nativeButton={false}
        render={<Link href={`/evaluator/assessments/detail?id=${assessment.id}`} />}
      >
        View
      </Button>
    );
  }

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
        setConfirmOpen(false);
      },
      onError: (error) => toast.error(getApiErrorMessage(error, 'Could not delete assessment.')),
    });

  const busy = updateStatus.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant='ghost'
              size='icon'
              aria-label={`Actions for ${assessment.title}`}
              disabled={busy}
            />
          }
        >
          {busy ? <Loader2 className='animate-spin' /> : <MoreHorizontal />}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            render={<Link href={`/evaluator/assessments/detail?id=${assessment.id}`} />}
          >
            <Eye /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href={`/evaluator/assessments/detail/edit?id=${assessment.id}`} />}
          >
            <Pencil /> Edit
          </DropdownMenuItem>
          {assessment.status !== 'PUBLISHED' && (
            <DropdownMenuItem onClick={() => changeStatus('PUBLISHED', 'Assessment published.')}>
              <Rocket /> Publish
            </DropdownMenuItem>
          )}
          {assessment.status === 'PUBLISHED' && (
            <>
              <DropdownMenuItem onClick={() => changeStatus('DRAFT', 'Assessment moved to draft.')}>
                <FileEdit /> Move to draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeStatus('ARCHIVED', 'Assessment archived.')}>
                <Archive /> Archive
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setConfirmOpen(true)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
  );
};

export default AssessmentRowActions;
