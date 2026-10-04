'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PlaceholderPage from '@/components/shared/placeholder-page';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PlaceholderPage
      title='Attempts'
      description='Your past attempts for this assessment.'
      api='GET /developer/assessments/:id/attempts'
      resourceId={id}
    />
  );
};

const DeveloperAssessmentsDetailAttemptsPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperAssessmentsDetailAttemptsPage;
