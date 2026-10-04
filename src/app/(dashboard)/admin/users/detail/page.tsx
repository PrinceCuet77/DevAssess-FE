'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import AdminUserDetailView from '@/components/modules/admin-users/admin-user-detail-view';

const UserDetail = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return <AdminUserDetailView userId={id} />;
};

const AdminUsersDetailPage = () => (
  <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
    <Suspense>
      <UserDetail />
    </Suspense>
  </div>
);

export default AdminUsersDetailPage;
