import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import CheckoutView from '@/components/modules/developer-checkout/checkout-view';

export const metadata: Metadata = {
  title: 'Checkout - DevAssess',
};

const DeveloperCheckoutPage = () => (
  <PageContainer>
    <Suspense>
      <CheckoutView />
    </Suspense>
  </PageContainer>
);

export default DeveloperCheckoutPage;
