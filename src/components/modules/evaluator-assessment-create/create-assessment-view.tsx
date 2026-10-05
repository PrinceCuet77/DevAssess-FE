'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AssessmentSummary from '@/components/modules/evaluator-assessment-create/assessment-summary';
import Field from '@/components/modules/evaluator-assessment-create/field';
import QuestionsBuilder, {
  createEmptyQuestion,
} from '@/components/modules/evaluator-assessment-create/questions-builder';
import ThumbnailUploader from '@/components/modules/evaluator-assessment-create/thumbnail-uploader';
import SkillsInput from '@/components/modules/profile/skills-input';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEvaluatorAssessment, useUpdateEvaluatorAssessmentStatus } from '@/hooks';
import { getApiErrorMessage, parseFieldErrors } from '@/lib/errors';
import { createAssessmentSchema, MAX_TAGS, type CreateAssessmentValues } from '@/validation/assessment.validation';
import type { CreateAssessmentPayload } from '@/types/evaluator-assessments.types';

const SERVER_FIELDS = ['title', 'description', 'duration', 'price', 'passingPercentage', 'tags'];

const defaultValues: CreateAssessmentValues = {
  title: '',
  description: '',
  tags: [],
  price: 0,
  duration: 30,
  passingPercentage: 60,
  thumbnailKey: '',
  questions: [createEmptyQuestion()],
};

const toPayload = (values: CreateAssessmentValues): CreateAssessmentPayload => ({
  title: values.title,
  ...(values.description && { description: values.description }),
  duration: values.duration,
  price: values.price,
  passingPercentage: values.passingPercentage,
  ...(values.thumbnailKey && { thumbnailKey: values.thumbnailKey }),
  ...(values.tags.length > 0 && { tags: values.tags }),
  questions: values.questions.map(({ id, question, marks, options }) => ({
    id,
    question,
    marks,
    options: options.map(({ id: optionId, text }) => ({ id: optionId, text })),
  })),
  // The API wants the answer key as a separate array of option ids.
  answer: values.questions.map((q) => ({ questionId: q.id, answer: q.correctOptionId })),
});

type SubmitMeta = { publish: boolean };

const CreateAssessmentView = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const savedRef = useRef(false);
  const { mutateAsync: createAssessment } = useCreateEvaluatorAssessment();
  const { mutateAsync: updateStatus } = useUpdateEvaluatorAssessmentStatus();

  const form = useForm({
    defaultValues,
    validators: { onChange: createAssessmentSchema },
    onSubmitMeta: { publish: false } as SubmitMeta,
    onSubmit: async ({ value, meta }) => {
      setServerErrors({});
      let created;
      try {
        created = await createAssessment(toPayload(createAssessmentSchema.parse(value)));
      } catch (error) {
        const fieldErrors = parseFieldErrors(error);
        if (SERVER_FIELDS.some((name) => fieldErrors[name])) {
          setServerErrors(fieldErrors);
          toast.error('Please fix the highlighted fields.');
        } else {
          toast.error(getApiErrorMessage(error, 'Could not create assessment. Please try again.'));
        }
        return;
      }

      savedRef.current = true;
      const { id } = created.data;
      if (meta.publish) {
        try {
          await updateStatus({ assessmentId: id, status: 'PUBLISHED' });
          toast.success('Assessment published.');
        } catch (error) {
          toast.error(getApiErrorMessage(error, 'Saved as draft, but could not publish. Try again from the details page.'));
        }
      } else {
        toast.success('Assessment saved as draft.');
      }
      router.push(`/evaluator/assessments/detail?id=${id}`);
    },
  });

  // Warn before closing/reloading the tab with unsaved work.
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (form.state.isDirty && !savedRef.current) event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [form]);

  const errorsFor = (field: { state: { meta: { isTouched: boolean; errors: unknown[] } }; name: string }) => [
    ...(field.state.meta.isTouched ? field.state.meta.errors : []),
    serverErrors[field.name],
  ];

  return (
    <PageContainer>
      <PageHeader
        title='New assessment'
        description='Fill in the details and add your questions. It is saved as a draft until you publish it.'
      />
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
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <div className='flex flex-col gap-2'>
                <Button type='submit' size='lg' className='h-11' disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className='animate-spin' />}
                  Save as draft
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='lg'
                  className='h-11'
                  disabled={isSubmitting}
                  onClick={() => form.handleSubmit({ publish: true })}
                >
                  Save &amp; publish
                </Button>
                <Button type='button' variant='ghost' disabled={isSubmitting} onClick={() => router.push('/evaluator/assessments')}>
                  Cancel
                </Button>
              </div>
            )}
          </form.Subscribe>
        </aside>
      </form>
    </PageContainer>
  );
};

export default CreateAssessmentView;
