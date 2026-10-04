import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin dashboard - DevAssess',
};

const AdminDashboardPage = () => {
  return (
    <div className='mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <h1 className='font-heading text-2xl font-semibold tracking-tight'>Admin dashboard</h1>
    </div>
  );
};

export default AdminDashboardPage;
