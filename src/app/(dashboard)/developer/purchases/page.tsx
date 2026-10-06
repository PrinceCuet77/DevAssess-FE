import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import DeveloperPurchasesView from '@/components/modules/developer-purchases/developer-purchases-view';
import PurchasesSkeleton from '@/components/modules/developer-purchases/purchases-skeleton';

export const metadata: Metadata = {
  title: 'Purchases - DevAssess',
};

const DeveloperPurchasesPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title='Purchases'
        description='Your orders and their payment status. Finish an unpaid order to unlock its assessments.'
      />
      <Suspense fallback={<PurchasesSkeleton />}>
        <DeveloperPurchasesView />
      </Suspense>
    </PageContainer>
  );
};

export default DeveloperPurchasesPage;
