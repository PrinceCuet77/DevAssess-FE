'use client';

import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react';
import FieldError from '@/components/form/field-error';
import Field from '@/components/modules/evaluator-assessment-create/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { MAX_OPTIONS, MIN_OPTIONS, type QuestionValues } from '@/validation/assessment.validation';

// Option ids are a, b, c… and never reused within a question, even after removing one.
const nextOptionId = (options: QuestionValues['options']) => {
  const used = new Set(options.map((o) => o.id));
  for (let code = 97; code < 123; code += 1) {
    const id = String.fromCharCode(code);
    if (!used.has(id)) return id;
  }
  return crypto.randomUUID();
};

type QuestionCardProps = {
  index: number;
  total: number;
  question: QuestionValues;
  // Validation messages keyed by the question's own field names, shown once the form was submitted/touched.
  errors: { question?: unknown[]; marks?: unknown[]; options?: unknown[]; correctOptionId?: unknown[]; optionTexts: unknown[][] };
  showErrors: boolean;
  disabled?: boolean;
  onChange: (next: QuestionValues) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
};

const QuestionCard = ({
  index,
  total,
  question,
  errors,
  showErrors,
  disabled,
  onChange,
  onRemove,
  onMove,
}: QuestionCardProps) => {
  const show = (list?: unknown[]) => (showErrors ? (list ?? []) : []);
  const idPrefix = `q-${question.id}`;

  const updateOption = (optionId: string, text: string) =>
    onChange({
      ...question,
      options: question.options.map((o) => (o.id === optionId ? { ...o, text } : o)),
    });

  const removeOption = (optionId: string) =>
    onChange({
      ...question,
      options: question.options.filter((o) => o.id !== optionId),
      correctOptionId: question.correctOptionId === optionId ? '' : question.correctOptionId,
    });

  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between gap-2'>
        <CardTitle>Question {index + 1}</CardTitle>
        <div className='flex items-center gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label='Move question up'
            disabled={disabled || index === 0}
            onClick={() => onMove(-1)}
          >
            <ArrowUp />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label='Move question down'
            disabled={disabled || index === total - 1}
            onClick={() => onMove(1)}
          >
            <ArrowDown />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label='Remove question'
            className='text-destructive hover:text-destructive'
            disabled={disabled || total === 1}
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-5'>
        <div className='grid gap-4 sm:grid-cols-[1fr_8rem]'>
          <Field id={`${idPrefix}-text`} label='Question' required errors={show(errors.question)}>
            <Textarea
              id={`${idPrefix}-text`}
              value={question.question}
              placeholder='What does HTTP 404 mean?'
              aria-invalid={show(errors.question).length > 0}
              onChange={(event) => onChange({ ...question, question: event.target.value })}
            />
          </Field>
          <Field id={`${idPrefix}-marks`} label='Marks' required errors={show(errors.marks)}>
            <Input
              id={`${idPrefix}-marks`}
              type='number'
              min={1}
              step={1}
              inputMode='numeric'
              className='h-11'
              value={Number.isNaN(question.marks) ? '' : question.marks}
              aria-invalid={show(errors.marks).length > 0}
              onChange={(event) => onChange({ ...question, marks: event.target.valueAsNumber })}
            />
          </Field>
        </div>

        <fieldset className='flex flex-col gap-2'>
          <legend className='mb-1 text-sm font-medium'>
            Options<span className='text-destructive'>*</span>
            <span className='ml-2 text-xs font-normal text-muted-foreground'>Select the radio of the correct answer</span>
          </legend>
          {question.options.map((option, optionIndex) => {
            const isCorrect = question.correctOptionId === option.id;
            const optionErrors = show(errors.optionTexts[optionIndex]);
            return (
              <div key={option.id} className='flex flex-col gap-1'>
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-lg border border-input px-3 py-1.5',
                    isCorrect && 'border-primary bg-primary/5',
                  )}
                >
                  <input
                    type='radio'
                    name={`${idPrefix}-correct`}
                    checked={isCorrect}
                    aria-label={`Mark option ${option.id.toUpperCase()} as correct`}
                    className='size-4 accent-primary'
                    onChange={() => onChange({ ...question, correctOptionId: option.id })}
                  />
                  <span className='w-4 text-sm font-medium text-muted-foreground uppercase'>{option.id.slice(0, 1)}</span>
                  <Input
                    value={option.text}
                    placeholder={`Option ${optionIndex + 1}`}
                    aria-label={`Option ${optionIndex + 1} text`}
                    aria-invalid={optionErrors.length > 0}
                    className='h-9 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0'
                    onChange={(event) => updateOption(option.id, event.target.value)}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    aria-label={`Remove option ${optionIndex + 1}`}
                    disabled={disabled || question.options.length <= MIN_OPTIONS}
                    onClick={() => removeOption(option.id)}
                  >
                    <X />
                  </Button>
                </div>
                <FieldError errors={optionErrors} />
              </div>
            );
          })}
          <FieldError errors={[...show(errors.options), ...show(errors.correctOptionId)]} />
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='self-start'
            disabled={disabled || question.options.length >= MAX_OPTIONS}
            onClick={() =>
              onChange({ ...question, options: [...question.options, { id: nextOptionId(question.options), text: '' }] })
            }
          >
            <Plus />
            Add option
          </Button>
        </fieldset>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
