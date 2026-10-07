'use client';

import DeveloperCharts from '@/components/modules/developer-dashboard/developer-charts';
import DashboardSkeleton from '@/components/modules/developer-dashboard/dashboard-skeleton';
import PendingBanner from '@/components/modules/developer-dashboard/pending-banner';
import RecentAttempts from '@/components/modules/developer-dashboard/recent-attempts';
import RecentPurchases from '@/components/modules/developer-dashboard/recent-purchases';
import StatsGrid from '@/components/modules/developer-dashboard/stats-grid';
import { Card, CardContent } from '@/components/ui/card';
import { useGetDeveloperDashboard } from '@/hooks';

const DeveloperDashboardView = () => {
  const { data, isPending, isError } = useGetDeveloperDashboard();

  if (isPending) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <Card>
        <CardContent className='py-6 text-center text-sm text-muted-foreground'>
          We couldn&apos;t load your dashboard. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  const { stats, recentAttempts, recentPurchases } = data;

  return (
    <div className='flex flex-col gap-6'>
      <PendingBanner count={stats.pendingAssessmentsToAttempt} />
      <StatsGrid stats={stats} />
      <DeveloperCharts stats={stats} attempts={recentAttempts} />
      <div className='grid gap-6 lg:grid-cols-2'>
        <RecentAttempts attempts={recentAttempts} />
        <RecentPurchases purchases={recentPurchases} />
      </div>
    </div>
  );
};

export default DeveloperDashboardView;
