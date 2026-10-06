'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import AssessmentSummary from '@/components/modules/evaluator-assessment-form/assessment-summary';
import Field from '@/components/modules/evaluator-assessment-form/field';
import QuestionsBuilder from '@/components/modules/evaluator-assessment-form/questions-builder';
import ThumbnailUploader from '@/components/modules/evaluator-assessment-form/thumbnail-uploader';
import SkillsInput from '@/components/modules/profile/skills-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getApiErrorMessage, parseFieldErrors } from '@/lib/errors';
import { assessmentFormSchema, MAX_TAGS, type AssessmentFormValues } from '@/validation/assessment.validation';

const SERVER_FIELDS = ['title', 'description', 'duration', 'price', 'passingPercentage', 'tags'];

export type SubmitMeta = { publish: boolean };

type AssessmentFormProps = {
  defaultValues: AssessmentFormValues;
  // Lets the edit form add rules that depend on the saved assessment.
  schema?: typeof assessmentFormSchema;
  // Already-saved thumbnail (edit mode).
  currentThumbnailUrl?: string | null;
  submitLabel: string;
  // Omit to hide the "save and publish" button (e.g. already published).
  publishLabel?: string;
  cancelHref: string;
  errorFallback: string;
  // Edit only PATCHes a diff, so it decides what "changed" means; create falls back to the form's dirty flag.
  hasChanges?: (values: AssessmentFormValues) => boolean;
  // Banner above the first card, e.g. "changes go live immediately".
  notice?: React.ReactNode;
  // Small print under the action buttons.
  footnote?: React.ReactNode;
  // Receives trimmed/parsed values. Throw the API error to have it mapped onto the fields.
  onSubmit: (values: AssessmentFormValues, meta: SubmitMeta) => Promise<void>;
};

const AssessmentForm = ({
  defaultValues,
  schema = assessmentFormSchema,
  currentThumbnailUrl,
  submitLabel,
  publishLabel,
  cancelHref,
  errorFallback,
  hasChanges,
  notice,
  footnote,
  onSubmit,
}: AssessmentFormProps) => {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const savedRef = useRef(false);

  const form = useForm({
    defaultValues,
    validators: { onChange: schema },
    onSubmitMeta: { publish: false } as SubmitMeta,
    onSubmit: async ({ value, meta }) => {
      setServerErrors({});
      try {
        await onSubmit(schema.parse(value), meta);
        savedRef.current = true;
      } catch (error) {
        const fieldErrors = parseFieldErrors(error);
        if (SERVER_FIELDS.some((name) => fieldErrors[name])) {
          setServerErrors(fieldErrors);
          toast.error('Please fix the highlighted fields.');
        } else {
          toast.error(getApiErrorMessage(error, errorFallback));
        }
      }
    },
  });

  const isChanged = (values: AssessmentFormValues) => (hasChanges ? hasChanges(values) : form.state.isDirty);

  // Warn before closing/reloading the tab with unsaved work.
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!savedRef.current && isChanged(form.state.values)) event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  });

  const errorsFor = (field: { state: { meta: { isTouched: boolean; errors: unknown[] } }; name: string }) => [
    ...(field.state.meta.isTouched ? field.state.meta.errors : []),
    serverErrors[field.name],
  ];

  return (
    <form
      noValidate
      className='grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]'
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit({ publish: false });
      }}
    >
      <div className='flex flex-col gap-6'>
        {notice}

        <Card>
          <CardHeader>
            <CardTitle>1. Basics</CardTitle>
            <CardDescription>What developers see in the marketplace.</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-5 sm:grid-cols-3'>
            <form.Field name='title'>
              {(field) => (
                <Field id='title' label='Title' required errors={errorsFor(field)} className='sm:col-span-3'>
                  <Input
                    id='title'
                    className='h-11'
                    placeholder='React Fundamentals'
                    value={field.state.value}
                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='description'>
              {(field) => (
                <Field
                  id='description'
                  label='Description'
                  hint={`${field.state.value.length}/2000`}
                  errors={errorsFor(field)}
                  className='sm:col-span-3'
                >
                  <Textarea
                    id='description'
                    placeholder='What does this assessment cover and who is it for?'
                    value={field.state.value}
                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='tags'>
              {(field) => (
                <Field id='tags' label='Tags' errors={errorsFor(field)} className='sm:col-span-3'>
                  <SkillsInput
                    id='tags'
                    noun='tag'
                    max={MAX_TAGS}
                    value={field.state.value}
                    onChange={(tags) => field.handleChange(tags)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='price'>
              {(field) => (
                <Field id='price' label='Price (BDT)' required hint='Use 0 for a free assessment.' errors={errorsFor(field)}>
                  <Input
                    id='price'
                    type='number'
                    min={0}
                    step='any'
                    inputMode='decimal'
                    className='h-11'
                    value={Number.isNaN(field.state.value) ? '' : field.state.value}
                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.valueAsNumber)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='duration'>
              {(field) => (
                <Field id='duration' label='Duration (minutes)' required errors={errorsFor(field)}>
                  <Input
                    id='duration'
                    type='number'
                    min={1}
                    step={1}
                    inputMode='numeric'
                    className='h-11'
                    value={Number.isNaN(field.state.value) ? '' : field.state.value}
                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.valueAsNumber)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='passingPercentage'>
              {(field) => (
                <Field id='passingPercentage' label='Passing score (%)' required errors={errorsFor(field)}>
                  <Input
                    id='passingPercentage'
                    type='number'
                    min={1}
                    max={100}
                    step={1}
                    inputMode='numeric'
                    className='h-11'
                    value={Number.isNaN(field.state.value) ? '' : field.state.value}
                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.valueAsNumber)}
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Thumbnail</CardTitle>
            <CardDescription>Optional cover image for the catalog.</CardDescription>
          </CardHeader>
          <CardContent>
            <form.Field name='thumbnailKey'>
              {(field) => (
                <ThumbnailUploader
                  value={field.state.value}
                  currentUrl={currentThumbnailUrl}
                  onChange={(key) => field.handleChange(key)}
                  disabled={form.state.isSubmitting}
                />
              )}
            </form.Field>
          </CardContent>
        </Card>

        <section className='flex flex-col gap-4' aria-labelledby='questions-heading'>
          <div className='flex flex-col gap-1'>
            <h2 id='questions-heading' className='font-heading text-lg font-medium'>
              3. Questions
            </h2>
            <p className='text-sm text-muted-foreground'>
              Each question needs at least two options and exactly one correct answer.
            </p>
          </div>
          <form.Subscribe selector={(state) => state.submissionAttempts > 0}>
            {(attempted) => (
              <form.Field name='questions'>
                {(field) => (
                  <QuestionsBuilder
                    value={field.state.value}
                    onChange={(next) => field.handleChange(next)}
                    errors={field.state.meta.errors.filter(
                      (e) => typeof e === 'string' || (e && typeof e === 'object' && 'message' in e),
                    )}
                    showErrors={attempted}
                    disabled={form.state.isSubmitting}
                  />
                )}
              </form.Field>
            )}
          </form.Subscribe>
        </section>
      </div>

      <aside className='flex flex-col gap-4 lg:sticky lg:top-20'>
        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <AssessmentSummary
              questions={values.questions}
              passingPercentage={values.passingPercentage}
              duration={values.duration}
              price={values.price}
            />
          )}
        </form.Subscribe>
        <form.Subscribe selector={(state) => [state.isSubmitting, isChanged(state.values)] as const}>
          {([isSubmitting, changed]) => (
            <div className='flex flex-col gap-2'>
              <Button type='submit' size='lg' className='h-11' disabled={isSubmitting || !changed}>
                {isSubmitting && <Loader2 className='animate-spin' />}
                {submitLabel}
              </Button>
              {publishLabel && (
                <Button
                  type='button'
                  variant='outline'
                  size='lg'
                  className='h-11'
                  disabled={isSubmitting}
                  onClick={() => form.handleSubmit({ publish: true })}
                >
                  {publishLabel}
                </Button>
              )}
              <Button
                variant='ghost'
                disabled={isSubmitting}
                nativeButton={false}
                render={<Link href={cancelHref} />}
              >
                Cancel
              </Button>
              {footnote && <div className='pt-1 text-center text-xs text-muted-foreground'>{footnote}</div>}
            </div>
          )}
        </form.Subscribe>
      </aside>
    </form>
  );
};

export default AssessmentForm;
