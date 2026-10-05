'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import EvaluatorAssessmentDetailView from '@/components/modules/evaluator-assessments/evaluator-assessment-detail-view';

const AssessmentDetail = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return <EvaluatorAssessmentDetailView assessmentId={id} />;
};

const EvaluatorAssessmentsDetailPage = () => (
  <PageContainer>
    <Suspense>
      <AssessmentDetail />
    </Suspense>
  </PageContainer>
);

export default EvaluatorAssessmentsDetailPage;
