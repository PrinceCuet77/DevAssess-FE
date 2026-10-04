import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Users - DevAssess',
};

const AdminUsersPage = () => {
  return (
    <PlaceholderPage
      title='Users'
      description='Manage marketplace users.'
      api='GET /admin/users'
    />
  );
};

export default AdminUsersPage;
