import BarChartCard from '@/components/shared/charts/bar-chart-card';
import DonutChartCard from '@/components/shared/charts/donut-chart-card';
import type { AdminDashboardStats } from '@/types/admin-dashboard.types';

type IProps = {
  stats: AdminDashboardStats;
  // The dashboard shows the headline charts; the analytics page shows every breakdown.
  detailed?: boolean;
};

export const attemptOutcomes = (stats: AdminDashboardStats) => [
  { key: 'passed', label: 'Passed', value: stats.totalPassedAttempts },
  { key: 'failed', label: 'Failed', value: stats.totalEvaluatedAttempts - stats.totalPassedAttempts },
  { key: 'pending', label: 'Not evaluated', value: stats.totalAttempts - stats.totalEvaluatedAttempts },
];

const AdminCharts = ({ stats, detailed }: IProps) => {
  const usersByRole = (
    <DonutChartCard
      title='Users by role'
      description='Who is on the platform.'
      totalLabel='users'
      slices={[
        { key: 'developers', label: 'Developers', value: stats.usersByRole.DEVELOPER ?? 0 },
        { key: 'evaluators', label: 'Evaluators', value: stats.usersByRole.EVALUATOR ?? 0 },
        { key: 'admins', label: 'Admins', value: stats.usersByRole.ADMIN ?? 0 },
      ]}
    />
  );

  const assessmentsByStatus = (
    <BarChartCard
      title='Assessments by status'
      description='State of the marketplace catalog.'
      valueLabel='Assessments'
      data={[
        { label: 'Published', value: stats.assessmentsByStatus.PUBLISHED ?? 0 },
        { label: 'Draft', value: stats.assessmentsByStatus.DRAFT ?? 0 },
        { label: 'Archived', value: stats.assessmentsByStatus.ARCHIVED ?? 0 },
        { label: 'Deleted', value: stats.assessmentsByStatus.DELETED ?? 0 },
      ]}
    />
  );

  const outcomes = (
    <DonutChartCard
      title='Attempt outcomes'
      description={`Pass rate ${stats.passRate.toFixed(1)}% across evaluated attempts.`}
      totalLabel='attempts'
      slices={attemptOutcomes(stats)}
    />
  );

  if (!detailed) {
    return (
      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {usersByRole}
        {outcomes}
        <div className='md:col-span-2 xl:col-span-1'>{assessmentsByStatus}</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {usersByRole}
        <DonutChartCard
          title='Users by status'
          description='Account health across all users.'
          totalLabel='users'
          slices={[
            { key: 'verified', label: 'Verified', value: stats.usersByStatus.VERIFIED ?? 0 },
            { key: 'unverified', label: 'Not verified', value: stats.usersByStatus.NOT_VERIFIED ?? 0 },
            { key: 'suspended', label: 'Suspended', value: stats.usersByStatus.SUSPENDED ?? 0 },
            { key: 'deleted', label: 'Deleted', value: stats.usersByStatus.DELETED ?? 0 },
          ]}
        />
        <div className='md:col-span-2 xl:col-span-1'>{outcomes}</div>
      </div>
      <div className='grid gap-6 lg:grid-cols-2'>
        {assessmentsByStatus}
        <BarChartCard
          title='Attempts by status'
          description='Where every developer attempt currently stands.'
          valueLabel='Attempts'
          data={[
            { label: 'Not started', value: stats.attemptsByStatus.IDLE ?? 0 },
            { label: 'In progress', value: stats.attemptsByStatus.IN_PROGRESS ?? 0 },
            { label: 'Submitted', value: stats.attemptsByStatus.SUBMITTED ?? 0 },
            { label: 'Evaluated', value: stats.attemptsByStatus.EVALUATED ?? 0 },
            { label: 'Expired', value: stats.attemptsByStatus.EXPIRED ?? 0 },
          ]}
        />
      </div>
      <BarChartCard
        title='Platform activity'
        description='Lifetime totals for the core marketplace actions.'
        valueLabel='Total'
        layout='horizontal'
        data={[
          { label: 'Users', value: stats.totalUsers },
          { label: 'Assessments', value: stats.totalAssessments },
          { label: 'Orders', value: stats.totalPurchases },
          { label: 'Attempts', value: stats.totalAttempts },
          { label: 'Reviews', value: stats.totalReviews },
        ]}
      />
    </div>
  );
};

export default AdminCharts;
