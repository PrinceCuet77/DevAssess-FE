'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PlaceholderPage from '@/components/shared/placeholder-page';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PlaceholderPage
      title='Assessment details'
      description='Review the assessment details and reviews before buying.'
      api='GET /assessments/:id'
      resourceId={id}
    />
  );
};

const DeveloperAssessmentsDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperAssessmentsDetailPage;
