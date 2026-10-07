'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import AttemptExamView from '@/components/modules/developer-attempt/attempt-exam-view';

const Content = () => {
  const params = useSearchParams();
  const id = params.get('id');
  const attemptId = params.get('attemptId');
  if (!id || !attemptId) notFound();

  return (
    <PageContainer className='pt-0 lg:pt-0'>
      <AttemptExamView assessmentId={id} attemptId={attemptId} />
    </PageContainer>
  );
};

const DeveloperAssessmentAttemptPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperAssessmentAttemptPage;
