import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminPurchasesView from '@/components/modules/admin-purchases/admin-purchases-view';
import { DataTableSkeleton } from '@/components/ui/data-table';

export const metadata: Metadata = {
  title: 'Purchases - DevAssess',
};

const AdminPurchasesPage = () => {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Purchases</h1>
        <p className='text-sm text-muted-foreground'>
          Every order across the marketplace, with its payment attempts.
        </p>
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <AdminPurchasesView />
      </Suspense>
    </div>
  );
};

export default AdminPurchasesPage;
