'use client';

import RecentAssessments from '@/components/modules/admin-dashboard/recent-assessments';
import RecentPurchases from '@/components/modules/admin-dashboard/recent-purchases';
import RecentUsers from '@/components/modules/admin-dashboard/recent-users';
import StatsGrid from '@/components/modules/admin-dashboard/stats-grid';
import DashboardSkeleton from '@/components/modules/admin-dashboard/dashboard-skeleton';
import AdminCharts from '@/components/modules/admin-dashboard/admin-charts';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAdminDashboard } from '@/hooks';

const AdminDashboardView = () => {
  const { data, isPending, isError } = useGetAdminDashboard();

  if (isPending) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <Card>
        <CardContent className='py-6 text-center text-sm text-muted-foreground'>
          We couldn&apos;t load the dashboard. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  const { stats, recentUsers, recentAssessments, recentPurchases } = data;

  return (
    <div className='flex flex-col gap-6'>
      <StatsGrid stats={stats} />
      <AdminCharts stats={stats} />
      <div className='grid gap-6 lg:grid-cols-2'>
        <RecentUsers users={recentUsers} />
        <RecentAssessments assessments={recentAssessments} />
      </div>
      <RecentPurchases purchases={recentPurchases} />
    </div>
  );
};

export default AdminDashboardView;
