import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Purchase details - DevAssess',
};

const AdminPurchasesDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Purchase details'
      description='Details of this purchase.'
      api='GET /purchases/:id'
      resourceId={id}
    />
  );
};

export default AdminPurchasesDetailPage;
