'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import DeveloperAssessmentDetailView from '@/components/modules/developer-assessments/developer-assessment-detail-view';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PageContainer>
      <DeveloperAssessmentDetailView assessmentId={id} />
    </PageContainer>
  );
};

const DeveloperAssessmentsDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperAssessmentsDetailPage;
