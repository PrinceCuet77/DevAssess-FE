'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PlaceholderPage from '@/components/shared/placeholder-page';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PlaceholderPage
      title='Payment details'
      description='Details for this payment.'
      api='GET /payments/:id'
      resourceId={id}
    />
  );
};

const DeveloperPaymentsDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperPaymentsDetailPage;
