import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer dashboard - DevAssess',
};

const DeveloperDashboardPage = () => {
  return (
    <div className='mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <h1 className='font-heading text-2xl font-semibold tracking-tight'>Developer dashboard</h1>
    </div>
  );
};

export default DeveloperDashboardPage;
