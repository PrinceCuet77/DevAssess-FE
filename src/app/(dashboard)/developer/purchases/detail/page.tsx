'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PlaceholderPage from '@/components/shared/placeholder-page';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PlaceholderPage
      title='Purchase details'
      description='Line items and payment status for this purchase.'
      api='GET /purchases/:id'
      resourceId={id}
    />
  );
};

const DeveloperPurchasesDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperPurchasesDetailPage;
