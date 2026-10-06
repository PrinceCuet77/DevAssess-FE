'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import DeveloperPaymentsView from '@/components/modules/developer-payments/developer-payments-view';
import PaymentResultView from '@/components/modules/developer-payments/payment-result-view';
import PaymentsSkeleton from '@/components/modules/developer-payments/payments-skeleton';

// The payment gateway sends the browser back here with ?status=…&purchaseId=…; otherwise this is the history list.
const Content = () => {
  const params = useSearchParams();
  const status = params.get('status');
  const purchaseId = params.get('purchaseId');
  const isReturn =
    purchaseId && (status === 'success' || status === 'failed' || status === 'cancelled');

  if (isReturn) {
    return (
      <PageContainer>
        <PageHeader title='Payment result' description='Here is what happened with your payment.' />
        <PaymentResultView status={status} purchaseId={purchaseId} tranId={params.get('tranId') ?? undefined} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title='Payments'
        description='Every payment attempt for your orders, successful or not.'
      />
      <DeveloperPaymentsView />
    </PageContainer>
  );
};

const DeveloperPaymentsPage = () => (
  <Suspense fallback={<PageContainer><PaymentsSkeleton /></PageContainer>}>
    <Content />
  </Suspense>
);

export default DeveloperPaymentsPage;
