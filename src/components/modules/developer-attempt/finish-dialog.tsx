import { Flag, Loader2, Send } from 'lucide-react';
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

type IProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  unanswered: number[]; // zero-based question indexes
  flaggedCount: number;
  finishing: boolean;
  onJump: (index: number) => void;
  onConfirm: () => void;
};

// The backend rejects partial answers, so finishing is blocked until every question is answered.
const FinishDialog = ({ open, onOpenChange, total, unanswered, flaggedCount, finishing, onJump, onConfirm }: IProps) => {
  const complete = unanswered.length === 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !finishing && onOpenChange(next)}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{complete ? 'Submit your answers?' : 'Some questions are unanswered'}</DialogTitle>
          <DialogDescription>
            {complete
              ? 'You can’t change your answers after submitting. Your attempt is scored right away.'
              : `Answer all ${total} questions before submitting. ${unanswered.length} still ${unanswered.length === 1 ? 'needs' : 'need'} an answer.`}
          </DialogDescription>
        </DialogHeader>

        {!complete && (
          <ul className='flex flex-wrap gap-1.5' aria-label='Unanswered questions'>
            {unanswered.map((index) => (
              <li key={index}>
                <Button
                  variant='outline'
                  size='sm'
                  className='tabular-nums'
                  onClick={() => {
                    onJump(index);
                    onOpenChange(false);
                  }}
                >
                  Q{index + 1}
                </Button>
              </li>
            ))}
          </ul>
        )}

        {complete && flaggedCount > 0 && (
          <p className='flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400'>
            <Flag className='size-4 shrink-0' aria-hidden />
            {flaggedCount} {flaggedCount === 1 ? 'question is' : 'questions are'} still flagged for review.
          </p>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant='outline' disabled={finishing} />}>Keep working</DialogClose>
          {complete ? (
            <Button onClick={onConfirm} disabled={finishing}>
              {finishing ? <Loader2 className='animate-spin' /> : <Send />}
              {finishing ? 'Scoring…' : 'Submit for scoring'}
            </Button>
          ) : (
            <Button
              onClick={() => {
                onJump(unanswered[0]);
                onOpenChange(false);
              }}
            >
              Go to Q{unanswered[0] + 1}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinishDialog;
