import type { Metadata } from 'next';
import AdminDashboardView from '@/components/modules/admin-dashboard/admin-dashboard-view';

export const metadata: Metadata = {
  title: 'Admin dashboard - DevAssess',
};

const AdminDashboardPage = () => {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Admin dashboard</h1>
        <p className='text-sm text-muted-foreground'>
          Oversee users, assessments and orders across the marketplace.
        </p>
      </div>
      <AdminDashboardView />
    </div>
  );
};

export default AdminDashboardPage;
