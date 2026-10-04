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
      description='Details of your assessment.'
      api='GET /evaluator/assessments/:id'
      resourceId={id}
    />
  );
};

const EvaluatorAssessmentsDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default EvaluatorAssessmentsDetailPage;
