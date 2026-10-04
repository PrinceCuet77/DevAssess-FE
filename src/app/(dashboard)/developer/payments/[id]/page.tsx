import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Payment details - DevAssess',
};

const DeveloperPaymentsDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Payment details'
      description='Details for this payment.'
      api='GET /payments/:id'
      resourceId={id}
    />
  );
};

export default DeveloperPaymentsDetailPage;
