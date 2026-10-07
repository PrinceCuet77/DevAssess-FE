import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import AdminUsersView from '@/components/modules/admin-users/admin-users-view';
import { UsersTableSkeleton } from '@/components/modules/admin-users/users-table';

export const metadata: Metadata = {
  title: 'Users | DevAssess',
};

const AdminUsersPage = () => {
  return (
    <PageContainer>
      <PageHeader title='Users' description='Manage marketplace users.' />
      <Suspense fallback={<UsersTableSkeleton />}>
        <AdminUsersView />
      </Suspense>
    </PageContainer>
  );
};

export default AdminUsersPage;
