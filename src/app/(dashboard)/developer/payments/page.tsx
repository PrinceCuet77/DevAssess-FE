import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Payments - DevAssess',
};

const DeveloperPaymentsPage = () => {
  return (
    <PlaceholderPage
      title='Payments'
      description='Your payment history.'
      api='GET /payments'
    />
  );
};

export default DeveloperPaymentsPage;
