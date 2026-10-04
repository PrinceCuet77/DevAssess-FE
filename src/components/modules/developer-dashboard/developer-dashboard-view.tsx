import PendingBanner from '@/components/modules/developer-dashboard/pending-banner';
import RecentAttempts from '@/components/modules/developer-dashboard/recent-attempts';
import RecentPurchases from '@/components/modules/developer-dashboard/recent-purchases';
import StatsGrid from '@/components/modules/developer-dashboard/stats-grid';
import { DEVELOPER_DASHBOARD_MOCK } from '@/components/modules/developer-dashboard/dashboard-mock';

// TODO: swap the mock for the GET /developer/dashboard query.
const DeveloperDashboardView = () => {
  const { stats, recentAttempts, recentPurchases } = DEVELOPER_DASHBOARD_MOCK;

  return (
    <div className='flex flex-col gap-6'>
      <PendingBanner count={stats.pendingAssessmentsToAttempt} />
      <StatsGrid stats={stats} />
      <div className='grid gap-6 lg:grid-cols-2'>
        <RecentAttempts attempts={recentAttempts} />
        <RecentPurchases purchases={recentPurchases} />
      </div>
    </div>
  );
};

export default DeveloperDashboardView;
