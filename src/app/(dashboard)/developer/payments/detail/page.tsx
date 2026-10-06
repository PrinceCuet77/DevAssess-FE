'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import PaymentDetailView from '@/components/modules/developer-payments/payment-detail-view';

const Content = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return (
    <PageContainer>
      <PaymentDetailView paymentId={id} />
    </PageContainer>
  );
};

const DeveloperPaymentsDetailPage = () => (
  <Suspense>
    <Content />
  </Suspense>
);

export default DeveloperPaymentsDetailPage;
