'use client';

import RecentAssessments from '@/components/modules/admin-dashboard/recent-assessments';
import RecentPurchases from '@/components/modules/admin-dashboard/recent-purchases';
import RecentUsers from '@/components/modules/admin-dashboard/recent-users';
import StatsGrid from '@/components/modules/admin-dashboard/stats-grid';
import DashboardSkeleton from '@/components/modules/admin-dashboard/dashboard-skeleton';
import StatusBreakdown from '@/components/shared/status-breakdown';
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
      <div className='grid gap-6 lg:grid-cols-2 2xl:grid-cols-4'>
        <StatusBreakdown
          title='Users by role'
          description='Who is on the platform.'
          rows={[
            { label: 'Developers', value: stats.usersByRole.DEVELOPER ?? 0 },
            { label: 'Evaluators', value: stats.usersByRole.EVALUATOR ?? 0 },
            { label: 'Admins', value: stats.usersByRole.ADMIN ?? 0 },
          ]}
        />
        <StatusBreakdown
          title='Users by status'
          description='Account health across all users.'
          rows={[
            { label: 'Verified', value: stats.usersByStatus.VERIFIED ?? 0 },
            { label: 'Not verified', value: stats.usersByStatus.NOT_VERIFIED ?? 0 },
            { label: 'Suspended', value: stats.usersByStatus.SUSPENDED ?? 0 },
            { label: 'Deleted', value: stats.usersByStatus.DELETED ?? 0 },
          ]}
        />
        <StatusBreakdown
          title='Assessments by status'
          description='State of the marketplace catalog.'
          rows={[
            { label: 'Published', value: stats.assessmentsByStatus.PUBLISHED ?? 0 },
            { label: 'Draft', value: stats.assessmentsByStatus.DRAFT ?? 0 },
            { label: 'Archived', value: stats.assessmentsByStatus.ARCHIVED ?? 0 },
            { label: 'Deleted', value: stats.assessmentsByStatus.DELETED ?? 0 },
          ]}
        />
        <StatusBreakdown
          title='Attempts by status'
          description='Progress of developer attempts.'
          rows={[
            { label: 'Evaluated', value: stats.attemptsByStatus.EVALUATED ?? 0 },
            { label: 'Submitted', value: stats.attemptsByStatus.SUBMITTED ?? 0 },
            { label: 'In progress', value: stats.attemptsByStatus.IN_PROGRESS ?? 0 },
          ]}
        />
      </div>
      <div className='grid gap-6 lg:grid-cols-2'>
        <RecentUsers users={recentUsers} />
        <RecentAssessments assessments={recentAssessments} />
      </div>
      <RecentPurchases purchases={recentPurchases} />
    </div>
  );
};

export default AdminDashboardView;
