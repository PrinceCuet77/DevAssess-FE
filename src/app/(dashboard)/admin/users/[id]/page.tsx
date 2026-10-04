import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'User details - DevAssess',
};

const AdminUsersDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='User details'
      description='Details and status for this user.'
      api='GET /admin/users/:userId'
      resourceId={id}
    />
  );
};

export default AdminUsersDetailPage;
