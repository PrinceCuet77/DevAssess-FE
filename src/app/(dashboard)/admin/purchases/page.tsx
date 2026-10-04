import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Purchases - DevAssess',
};

const AdminPurchasesPage = () => {
  return (
    <PlaceholderPage
      title='Purchases'
      description='All purchases across the marketplace.'
      api='GET /admin/purchases'
    />
  );
};

export default AdminPurchasesPage;
