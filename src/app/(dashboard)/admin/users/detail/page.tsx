'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import AdminUserDetailView from '@/components/modules/admin-users/admin-user-detail-view';

const UserDetail = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return <AdminUserDetailView userId={id} />;
};

const AdminUsersDetailPage = () => (
  <PageContainer>
    <Suspense>
      <UserDetail />
    </Suspense>
  </PageContainer>
);

export default AdminUsersDetailPage;
