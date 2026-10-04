'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import EvaluatorAssessmentDetailView from '@/components/modules/evaluator-assessments/evaluator-assessment-detail-view';

const AssessmentDetail = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return <EvaluatorAssessmentDetailView assessmentId={id} />;
};

const EvaluatorAssessmentsDetailPage = () => (
  <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
    <Suspense>
      <AssessmentDetail />
    </Suspense>
  </div>
);

export default EvaluatorAssessmentsDetailPage;
