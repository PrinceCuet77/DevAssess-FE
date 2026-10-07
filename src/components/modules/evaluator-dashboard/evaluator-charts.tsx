import BarChartCard from '@/components/shared/charts/bar-chart-card';
import DonutChartCard from '@/components/shared/charts/donut-chart-card';
import type { EvaluatorDashboardStats, EvaluatorTopAssessment } from '@/types/evaluator-dashboard.types';

type IProps = {
  stats: EvaluatorDashboardStats;
  topAssessments: EvaluatorTopAssessment[];
};

const EvaluatorCharts = ({ stats, topAssessments }: IProps) => (
  <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
    <DonutChartCard
      title='Assessments by status'
      description='Where your assessments stand.'
      totalLabel='assessments'
      slices={[
        { key: 'published', label: 'Published', value: stats.assessmentsByStatus.PUBLISHED ?? 0 },
        { key: 'draft', label: 'Draft', value: stats.assessmentsByStatus.DRAFT ?? 0 },
        { key: 'archived', label: 'Archived', value: stats.assessmentsByStatus.ARCHIVED ?? 0 },
      ]}
    />
    <DonutChartCard
      title='Attempt outcomes'
      description={`Pass rate ${stats.passRate.toFixed(1)}% on your assessments.`}
      totalLabel='attempts'
      slices={[
        { key: 'passed', label: 'Passed', value: stats.totalPassedAttempts },
        { key: 'failed', label: 'Failed', value: stats.totalEvaluatedAttempts - stats.totalPassedAttempts },
        { key: 'pending', label: 'Not evaluated', value: stats.totalAttempts - stats.totalEvaluatedAttempts },
      ]}
    />
    <div className='md:col-span-2 xl:col-span-1'>
      <BarChartCard
        title='Sales by assessment'
        description='Orders for your best-selling assessments.'
        valueLabel='Orders'
        layout='horizontal'
        data={topAssessments.map((a) => ({ label: a.title, value: a._count.purchases }))}
      />
    </div>
  </div>
);

export default EvaluatorCharts;
