'use client';

import { Plus } from 'lucide-react';
import FieldError from '@/components/form/field-error';
import QuestionCard from '@/components/modules/evaluator-assessment-form/question-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { questionSchema, type QuestionValues } from '@/validation/assessment.validation';

export const createEmptyQuestion = (): QuestionValues => ({
  id: crypto.randomUUID(),
  question: '',
  marks: 1,
  options: [
    { id: 'a', text: '' },
    { id: 'b', text: '' },
  ],
  correctOptionId: '',
});

type QuestionErrors = Parameters<typeof QuestionCard>[0]['errors'];

// Group a question's zod issues by the field they belong to, so each input can show its own message.
const collectErrors = (question: QuestionValues): QuestionErrors => {
  const errors: QuestionErrors = { optionTexts: [] };
  const result = questionSchema.safeParse(question);
  if (result.success) return errors;
  for (const issue of result.error.issues) {
    const [key, index] = issue.path;
    if (key === 'options' && typeof index === 'number') {
      (errors.optionTexts[index] ??= []).push(issue.message);
    } else if (key === 'question' || key === 'marks' || key === 'options' || key === 'correctOptionId') {
      (errors[key] ??= []).push(issue.message);
    }
  }
  return errors;
};

type QuestionsBuilderProps = {
  value: QuestionValues[];
  onChange: (next: QuestionValues[]) => void;
  // Form-level problems such as "Add at least one question".
  errors: unknown[];
  showErrors: boolean;
  disabled?: boolean;
};

const QuestionsBuilder = ({ value, onChange, errors, showErrors, disabled }: QuestionsBuilderProps) => {
  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onChange(next);
  };

  return (
    <div className='flex flex-col gap-4'>
      {value.map((question, index) => (
        <QuestionCard
          key={question.id}
          index={index}
          total={value.length}
          question={question}
          errors={collectErrors(question)}
          showErrors={showErrors}
          disabled={disabled}
          onChange={(next) => onChange(value.map((q, i) => (i === index ? next : q)))}
          onRemove={() => onChange(value.filter((_, i) => i !== index))}
          onMove={(direction) => move(index, direction)}
        />
      ))}
      <Card className='border-dashed'>
        <CardContent className='flex flex-col items-center gap-2'>
          <Button type='button' variant='outline' disabled={disabled} onClick={() => onChange([...value, createEmptyQuestion()])}>
            <Plus />
            Add question
          </Button>
          {showErrors && <FieldError errors={errors} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionsBuilder;
