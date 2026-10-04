import type { Metadata } from 'next';
import AdminUserDetailView from '@/components/modules/admin-users/admin-user-detail-view';

export const metadata: Metadata = {
  title: 'User details - DevAssess',
};

const AdminUsersDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <AdminUserDetailView userId={id} />
    </div>
  );
};

export default AdminUsersDetailPage;
