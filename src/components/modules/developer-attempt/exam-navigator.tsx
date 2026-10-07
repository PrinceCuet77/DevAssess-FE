import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AttemptQuestion } from '@/types/developer-assessments.types';

type IProps = {
  questions: AttemptQuestion[];
  answers: Record<string, string>;
  flagged: string[];
  current: number;
  onJump: (index: number) => void;
};

const Legend = ({ className, label }: { className: string; label: string }) => (
  <span className='flex items-center gap-1.5'>
    <span aria-hidden className={cn('size-3 rounded', className)} />
    {label}
  </span>
);

const ExamNavigator = ({ questions, answers, flagged, current, onJump }: IProps) => {
  const answered = questions.filter((q) => answers[q.id]).length;

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle>Questions</CardTitle>
        <p className='text-xs text-muted-foreground tabular-nums'>
          {answered} of {questions.length} answered
        </p>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <ol className='grid grid-cols-6 gap-1.5 sm:grid-cols-10 lg:grid-cols-5'>
          {questions.map((q, i) => {
            const isAnswered = Boolean(answers[q.id]);
            const isFlagged = flagged.includes(q.id);
            const state = [isAnswered ? 'answered' : 'not answered', isFlagged && 'flagged'].filter(Boolean).join(', ');
            return (
              <li key={q.id}>
                <button
                  type='button'
                  onClick={() => onJump(i)}
                  aria-current={i === current ? 'step' : undefined}
                  aria-label={`Question ${i + 1}, ${state}`}
                  className={cn(
                    'relative flex aspect-square w-full items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                    isAnswered
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted',
                    i === current && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
                  )}
                >
                  {i + 1}
                  {isFlagged && (
                    <span aria-hidden className='absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-500 ring-2 ring-background' />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
        <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
          <Legend className='bg-primary' label='Answered' />
          <Legend className='border border-border' label='Not answered' />
          <Legend className='rounded-full bg-amber-500' label='Flagged' />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamNavigator;
