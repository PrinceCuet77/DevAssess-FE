import BarChartCard from '@/components/shared/charts/bar-chart-card';
import DonutChartCard from '@/components/shared/charts/donut-chart-card';
import type { DeveloperDashboardStats, DeveloperRecentAttempt } from '@/types/developer-dashboard.types';

type IProps = {
  stats: DeveloperDashboardStats;
  attempts: DeveloperRecentAttempt[];
};

const DeveloperCharts = ({ stats, attempts }: IProps) => {
  // Oldest first so the bars read left to right as a timeline.
  const scored = attempts
    .filter((a) => a.score !== null)
    .reverse()
    .map((a) => ({ label: a.assessment.title, value: a.score ?? 0 }));

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]'>
      <DonutChartCard
        title='Attempt outcomes'
        description={
          stats.totalEvaluatedAttempts
            ? `Pass rate ${stats.passRate.toFixed(1)}% across evaluated attempts.`
            : 'No evaluated attempts yet.'
        }
        totalLabel='attempts'
        slices={[
          { key: 'passed', label: 'Passed', value: stats.passedAttemptsCount },
          { key: 'failed', label: 'Failed', value: stats.totalEvaluatedAttempts - stats.passedAttemptsCount },
          { key: 'pending', label: 'Not evaluated', value: stats.totalAttempts - stats.totalEvaluatedAttempts },
        ]}
      />
      <BarChartCard
        title='Recent scores'
        description='Scores from your latest evaluated attempts.'
        valueLabel='Score'
        data={scored}
      />
    </div>
  );
};

export default DeveloperCharts;
