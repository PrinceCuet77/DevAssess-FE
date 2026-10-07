'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import AttemptStartView from '@/components/modules/developer-attempt/attempt-start-view';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PageContainer>
      <AttemptStartView assessmentId={id} />
    </PageContainer>
  );
};

const DeveloperAssessmentsDetailTakePage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperAssessmentsDetailTakePage;
