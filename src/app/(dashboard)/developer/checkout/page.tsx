import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Checkout - DevAssess',
};

const DeveloperCheckoutPage = () => {
  return (
    <PlaceholderPage
      title='Checkout'
      description='Review your cart and pay for your assessments.'
      api='POST /purchases, POST /payments/create'
    />
  );
};

export default DeveloperCheckoutPage;
