'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import PurchaseDetailView from '@/components/modules/developer-purchases/purchase-detail-view';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PageContainer>
      <PurchaseDetailView purchaseId={id} />
    </PageContainer>
  );
};

const DeveloperPurchasesDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperPurchasesDetailPage;
