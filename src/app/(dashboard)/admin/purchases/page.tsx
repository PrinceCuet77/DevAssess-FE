import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import AdminPurchasesView from '@/components/modules/admin-purchases/admin-purchases-view';
import { DataTableSkeleton } from '@/components/ui/data-table';

export const metadata: Metadata = {
  title: 'Purchases | DevAssess',
};

const AdminPurchasesPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title='Purchases'
        description='Every order across the marketplace, with its payment attempts.'
      />
      <Suspense fallback={<DataTableSkeleton />}>
        <AdminPurchasesView />
      </Suspense>
    </PageContainer>
  );
};

export default AdminPurchasesPage;
