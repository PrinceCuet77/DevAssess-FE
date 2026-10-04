'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PlaceholderPage from '@/components/shared/placeholder-page';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PlaceholderPage
      title='Review'
      description='View, edit or delete this review.'
      api='GET/PATCH/DELETE /reviews/:id'
      resourceId={id}
    />
  );
};

const DeveloperReviewsDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperReviewsDetailPage;
