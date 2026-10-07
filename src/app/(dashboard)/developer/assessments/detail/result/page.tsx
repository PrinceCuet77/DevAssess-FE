'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import AttemptResultView from '@/components/modules/developer-attempt/attempt-result-view';

const Content = () => {
  const params = useSearchParams();
  const id = params.get('id');
  const attemptId = params.get('attemptId');
  if (!id || !attemptId) notFound();

  return (
    <PageContainer>
      <AttemptResultView assessmentId={id} attemptId={attemptId} />
    </PageContainer>
  );
};

const DeveloperAssessmentResultPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperAssessmentResultPage;
