'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PlaceholderPage from '@/components/shared/placeholder-page';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PlaceholderPage
      title='Edit assessment'
      description='Update, publish or archive this assessment.'
      api='PATCH /evaluator/assessments/:id'
      resourceId={id}
    />
  );
};

const EvaluatorAssessmentsDetailEditPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default EvaluatorAssessmentsDetailEditPage;
