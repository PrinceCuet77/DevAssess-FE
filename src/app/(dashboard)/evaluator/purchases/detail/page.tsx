'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import EvaluatorPurchaseDetailView from '@/components/modules/evaluator-purchases/evaluator-purchase-detail-view';

const PurchaseDetail = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return <EvaluatorPurchaseDetailView purchaseId={id} />;
};

const EvaluatorPurchasesDetailPage = () => (
  <PageContainer>
    <Suspense>
      <PurchaseDetail />
    </Suspense>
  </PageContainer>
);

export default EvaluatorPurchasesDetailPage;
