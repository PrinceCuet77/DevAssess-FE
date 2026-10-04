import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminUsersView from '@/components/modules/admin-users/admin-users-view';
import { UsersTableSkeleton } from '@/components/modules/admin-users/users-table';

export const metadata: Metadata = {
  title: 'Users - DevAssess',
};

const AdminUsersPage = () => {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Users</h1>
        <p className='text-sm text-muted-foreground'>Manage marketplace users.</p>
      </div>
      <Suspense fallback={<UsersTableSkeleton />}>
        <AdminUsersView />
      </Suspense>
    </div>
  );
};

export default AdminUsersPage;
