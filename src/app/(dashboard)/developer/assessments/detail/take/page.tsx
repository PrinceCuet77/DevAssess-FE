'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PlaceholderPage from '@/components/shared/placeholder-page';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PlaceholderPage
      title='Take assessment'
      description='Start your attempt and submit your answers.'
      api='GET /developer/assessments/:id/start'
      resourceId={id}
    />
  );
};

const DeveloperAssessmentsDetailTakePage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperAssessmentsDetailTakePage;
