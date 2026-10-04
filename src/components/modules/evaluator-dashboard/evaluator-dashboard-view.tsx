import RecentReviews from '@/components/modules/evaluator-dashboard/recent-reviews';
import RecentSales from '@/components/modules/evaluator-dashboard/recent-sales';
import StatsGrid from '@/components/modules/evaluator-dashboard/stats-grid';
import StatusBreakdown from '@/components/modules/evaluator-dashboard/status-breakdown';
import TopAssessments from '@/components/modules/evaluator-dashboard/top-assessments';
import { MOCK_EVALUATOR_DASHBOARD } from '@/components/modules/evaluator-dashboard/mock-data';

const EvaluatorDashboardView = () => {
  // TODO: replace placeholder data with the evaluator dashboard API hook.
  const { stats, recentPurchases, recentReviews, topAssessments } = MOCK_EVALUATOR_DASHBOARD;

  return (
    <div className='flex flex-col gap-6'>
      <StatsGrid stats={stats} />
      <div className='grid gap-6 lg:grid-cols-2'>
        <StatusBreakdown
          title='Assessments by status'
          description='Where your assessments stand.'
          rows={[
            { label: 'Published', value: stats.assessmentsByStatus.PUBLISHED ?? 0 },
            { label: 'Draft', value: stats.assessmentsByStatus.DRAFT ?? 0 },
            { label: 'Archived', value: stats.assessmentsByStatus.ARCHIVED ?? 0 },
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
        <RecentSales purchases={recentPurchases} />
        <TopAssessments assessments={topAssessments} />
      </div>
      <RecentReviews reviews={recentReviews} />
    </div>
  );
};

export default EvaluatorDashboardView;
