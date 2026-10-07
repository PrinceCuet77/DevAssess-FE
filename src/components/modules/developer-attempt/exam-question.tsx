import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AttemptQuestion } from '@/types/developer-assessments.types';

type IProps = {
  question: AttemptQuestion;
  index: number;
  total: number;
  selected?: string;
  flagged: boolean;
  locked: boolean;
  onSelect: (optionId: string) => void;
  onToggleFlag: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const OPTION_LETTERS = 'ABCDEFGHIJ';

const ExamQuestion = ({ question, index, total, selected, flagged, locked, onSelect, onToggleFlag, onPrev, onNext }: IProps) => {
  const name = `question-${question.id}`;

  return (
    <Card>
      <CardHeader className='flex flex-row flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-muted-foreground'>
            Question {index + 1} of {total}
          </span>
          <Badge variant='secondary'>
            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
          </Badge>
        </div>
        <Button
          variant={flagged ? 'secondary' : 'ghost'}
          size='sm'
          aria-pressed={flagged}
          disabled={locked}
          onClick={onToggleFlag}
          className={cn(flagged && 'text-amber-600 dark:text-amber-400')}
        >
          <Flag className={cn(flagged && 'fill-current')} />
          {flagged ? 'Flagged for review' : 'Flag for review'}
        </Button>
      </CardHeader>

      <CardContent className='flex flex-col gap-5'>
        <h2 id={`${name}-label`} className='text-base leading-relaxed font-medium break-words whitespace-pre-line'>
          {question.question}
        </h2>

        <div role='radiogroup' aria-labelledby={`${name}-label`} className='flex flex-col gap-2.5'>
          {question.options.map((option, i) => {
            const checked = selected === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50',
                  checked ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                  locked && 'cursor-not-allowed opacity-70',
                )}
              >
                <input
                  type='radio'
                  name={name}
                  value={option.id}
                  checked={checked}
                  disabled={locked}
                  onChange={() => onSelect(option.id)}
                  className='sr-only'
                />
                <span
                  aria-hidden
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                    checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground',
                  )}
                >
                  {OPTION_LETTERS[i] ?? i + 1}
                </span>
                <span className='pt-0.5 break-words whitespace-pre-line'>{option.text}</span>
              </label>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className='justify-between gap-2'>
        <Button variant='outline' onClick={onPrev} disabled={index === 0}>
          <ChevronLeft />
          Previous
        </Button>
        <Button variant='outline' onClick={onNext} disabled={index === total - 1}>
          Next
          <ChevronRight />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExamQuestion;
