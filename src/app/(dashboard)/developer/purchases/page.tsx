import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Purchases - DevAssess',
};

const DeveloperPurchasesPage = () => {
  return (
    <PlaceholderPage
      title='Purchases'
      description='Your purchase history.'
      api='GET /purchases'
    />
  );
};

export default DeveloperPurchasesPage;
