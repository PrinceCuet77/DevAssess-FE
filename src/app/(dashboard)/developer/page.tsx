import type { Metadata } from 'next';
import DeveloperDashboardView from '@/components/modules/developer-dashboard/developer-dashboard-view';

export const metadata: Metadata = {
  title: 'Developer dashboard - DevAssess',
};

const DeveloperDashboardPage = () => {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Developer dashboard</h1>
        <p className='text-sm text-muted-foreground'>
          Track your assessments, attempts and results.
        </p>
      </div>
      <DeveloperDashboardView />
    </div>
  );
};

export default DeveloperDashboardPage;
