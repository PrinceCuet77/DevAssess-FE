'use client';

import { useState } from 'react';
import { AlertTriangle, ArrowLeft, RotateCw, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { FetchError } from 'ofetch';
import { toast } from 'sonner';
import AssessmentStatusBadge from '@/components/modules/admin-assessments/assessment-status-badge';
import AssessmentForm, { type SubmitMeta } from '@/components/modules/evaluator-assessment-form/assessment-form';
import {
  hasUpdates,
  toFormValues,
  toUpdatePayload,
} from '@/components/modules/evaluator-assessment-form/assessment-mappers';
import EditAssessmentSkeleton from '@/components/modules/evaluator-assessment-form/edit-assessment-skeleton';
import { salesByAssessment } from '@/components/modules/evaluator-assessments/purchase-stats';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetEvaluatorAssessment, useGetEvaluatorPurchases, useUpdateEvaluatorAssessment } from '@/hooks';
import { assessmentFormSchema, type AssessmentFormValues } from '@/validation/assessment.validation';
import type { EvaluatorAssessmentDetail } from '@/types/evaluator-assessments.types';

const detailHref = (id: string) => `/evaluator/assessments/detail?id=${id}`;

// The API rejects empty strings, so a saved description can be reworded but not cleared.
const editSchemaFor = (initial: AssessmentFormValues) =>
  initial.description
    ? assessmentFormSchema.refine((values) => values.description.trim().length > 0, {
        path: ['description'],
        message: 'A saved description can be changed but not removed',
      })
    : assessmentFormSchema;

const BackLink = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className='inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground'>
    <ArrowLeft className='size-4' /> {label}
  </Link>
);

// The backend doesn't version content, so edits to a live or sold assessment reach existing buyers too.
const LiveEditNotice = ({ assessment }: { assessment: EvaluatorAssessmentDetail }) => {
  const { data: orders } = useGetEvaluatorPurchases(assessment.id);
  const purchases = orders ? (salesByAssessment(orders).get(assessment.id)?.purchases ?? 0) : 0;
  const isLive = assessment.status === 'PUBLISHED';
  if (!isLive && purchases === 0) return null;

  return (
    <div
      role='note'
      className='flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm'
    >
      <AlertTriangle className='mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400' />
      <div className='flex flex-col gap-0.5'>
        <p className='font-medium'>
          {isLive ? 'This assessment is live in the marketplace.' : 'This assessment has already been purchased.'}
        </p>
        <p className='text-muted-foreground'>
          {purchases > 0
            ? `${purchases} ${purchases === 1 ? 'developer has' : 'developers have'} bought it. Changes to questions, answers and price aren't versioned, so existing buyers will see them too.`
            : 'Changes are visible to developers as soon as you save.'}
        </p>
      </div>
    </div>
  );
};

const EditAssessmentForm = ({ assessment }: { assessment: EvaluatorAssessmentDetail }) => {
  const router = useRouter();
  // Snapshot the loaded values once: the diff is taken against them, not against background refetches.
  const [initial] = useState(() => toFormValues(assessment));
  const schema = editSchemaFor(initial);
  const { mutateAsync: updateAssessment } = useUpdateEvaluatorAssessment();
  const isPublished = assessment.status === 'PUBLISHED';

  // One PATCH carries both the edits and, when asked, the status change.
  const handleSubmit = async (values: AssessmentFormValues, { publish }: SubmitMeta) => {
    const payload = { ...toUpdatePayload(initial, values), ...(publish && { status: 'PUBLISHED' as const }) };
    if (!hasUpdates(payload)) {
      toast.info('No changes to save.');
      return;
    }
    await updateAssessment({ assessmentId: assessment.id, payload });
    toast.success(publish ? 'Changes saved and assessment published.' : 'Changes saved.');
    router.push(detailHref(assessment.id));
  };

  return (
    <AssessmentForm
      defaultValues={initial}
      schema={schema}
      currentThumbnailUrl={assessment.thumbnailUrl}
      submitLabel='Save changes'
      publishLabel={isPublished ? undefined : 'Save & publish'}
      cancelHref={detailHref(assessment.id)}
      errorFallback='Could not save your changes. Please try again.'
      hasChanges={(values) => hasUpdates(toUpdatePayload(initial, values))}
      notice={<LiveEditNotice assessment={assessment} />}
      footnote={`Last saved ${new Date(assessment.updatedAt).toLocaleString()}`}
      onSubmit={handleSubmit}
    />
  );
};

const StateCard = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof ShieldAlert;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardContent className='flex flex-col items-center gap-3 py-10 text-center'>
      <span className='flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-5' />
      </span>
      <div className='flex max-w-md flex-col gap-1'>
        <p className='font-heading font-medium'>{title}</p>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
      <div className='flex flex-wrap justify-center gap-2 pt-1'>{children}</div>
    </CardContent>
  </Card>
);

const EditAssessmentContent = ({ assessmentId }: { assessmentId: string }) => {
  const { data: assessment, isPending, error, refetch, isRefetching } = useGetEvaluatorAssessment(assessmentId);

  if (isPending && !error) return <EditAssessmentSkeleton />;

  if (!assessment) {
    // 404 also covers "not yours"; 400 covers a malformed id.
    if (error instanceof FetchError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <StateCard
        icon={AlertTriangle}
        title="We couldn't load this assessment"
        description='Check your connection and try again.'
      >
        <Button variant='outline' disabled={isRefetching} onClick={() => refetch()}>
          <RotateCw className={isRefetching ? 'animate-spin' : undefined} /> Try again
        </Button>
      </StateCard>
    );
  }

  // The API would still accept a PATCH here (even back to PUBLISHED), but deleted assessments are read-only by design.
  if (assessment.status === 'DELETED') {
    return (
      <StateCard
        icon={ShieldAlert}
        title='This assessment was deleted'
        description='Deleted assessments are read-only and can no longer be edited or republished.'
      >
        <Button variant='outline' nativeButton={false} render={<Link href={detailHref(assessment.id)} />}>
          View details
        </Button>
        <Button nativeButton={false} render={<Link href='/evaluator/assessments' />}>
          Back to assessments
        </Button>
      </StateCard>
    );
  }

  return (
    <>
      <PageHeader
        title='Edit assessment'
        description={`Update the details, thumbnail or questions of “${assessment.title}”.`}
        actions={<AssessmentStatusBadge status={assessment.status} />}
      />
      <EditAssessmentForm key={assessment.id} assessment={assessment} />
    </>
  );
};

const EditAssessmentView = ({ assessmentId }: { assessmentId: string }) => (
  <PageContainer>
    <BackLink href={detailHref(assessmentId)} label='Back to assessment' />
    <EditAssessmentContent assessmentId={assessmentId} />
  </PageContainer>
);

export default EditAssessmentView;
