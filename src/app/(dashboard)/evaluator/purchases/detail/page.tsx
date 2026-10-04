'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PlaceholderPage from '@/components/shared/placeholder-page';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PlaceholderPage
      title='Sale details'
      description='Line items for this purchase.'
      api='GET /evaluator/purchases/:id'
      resourceId={id}
    />
  );
};

const EvaluatorPurchasesDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default EvaluatorPurchasesDetailPage;
