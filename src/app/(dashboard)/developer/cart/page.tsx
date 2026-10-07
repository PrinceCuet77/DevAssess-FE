import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import CartView from '@/components/modules/developer-checkout/cart-view';

export const metadata: Metadata = {
  title: 'Cart | DevAssess',
};

const DeveloperCartPage = () => (
  <PageContainer>
    <PageHeader title='Cart' description='Check out several assessments in one order and one payment.' />
    <CartView />
  </PageContainer>
);

export default DeveloperCartPage;
