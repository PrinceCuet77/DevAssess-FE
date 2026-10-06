'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AssessmentForm, { type SubmitMeta } from '@/components/modules/evaluator-assessment-form/assessment-form';
import { toCreatePayload } from '@/components/modules/evaluator-assessment-form/assessment-mappers';
import { createEmptyQuestion } from '@/components/modules/evaluator-assessment-form/questions-builder';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import { useCreateEvaluatorAssessment, useUpdateEvaluatorAssessmentStatus } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import type { AssessmentFormValues } from '@/validation/assessment.validation';

const defaultValues: AssessmentFormValues = {
  title: '',
  description: '',
  tags: [],
  price: 0,
  duration: 30,
  passingPercentage: 60,
  thumbnailKey: '',
  questions: [createEmptyQuestion()],
};

const CreateAssessmentView = () => {
  const router = useRouter();
  const { mutateAsync: createAssessment } = useCreateEvaluatorAssessment();
  const { mutateAsync: updateStatus } = useUpdateEvaluatorAssessmentStatus();

  // Create always lands as DRAFT, so publishing is a second request.
  const handleSubmit = async (values: AssessmentFormValues, { publish }: SubmitMeta) => {
    const { data } = await createAssessment(toCreatePayload(values));
    if (publish) {
      try {
        await updateStatus({ assessmentId: data.id, status: 'PUBLISHED' });
        toast.success('Assessment published.');
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Saved as draft, but could not publish. Try again from the details page.'));
      }
    } else {
      toast.success('Assessment saved as draft.');
    }
    router.push(`/evaluator/assessments/detail?id=${data.id}`);
  };

  return (
    <PageContainer>
      <PageHeader
        title='New assessment'
        description='Fill in the details and add your questions. It is saved as a draft until you publish it.'
      />
      <AssessmentForm
        defaultValues={defaultValues}
        submitLabel='Save as draft'
        publishLabel='Save & publish'
        cancelHref='/evaluator/assessments'
        errorFallback='Could not create assessment. Please try again.'
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default CreateAssessmentView;
