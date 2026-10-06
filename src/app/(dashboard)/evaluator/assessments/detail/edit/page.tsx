'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import EditAssessmentView from '@/components/modules/evaluator-assessment-form/edit-assessment-view';

const EditAssessment = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return <EditAssessmentView assessmentId={id} />;
};

const EvaluatorAssessmentsDetailEditPage = () => (
  <Suspense>
    <EditAssessment />
  </Suspense>
);

export default EvaluatorAssessmentsDetailEditPage;
