import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import EvaluatorDashboardView from '@/components/modules/evaluator-dashboard/evaluator-dashboard-view';

export const metadata: Metadata = {
  title: 'Evaluator dashboard | DevAssess',
};

const EvaluatorDashboardPage = () => {
  return (
    <PageContainer>
      <PageHeader title='Evaluator dashboard' description='Track your assessments, sales and reviews.' />
      <EvaluatorDashboardView />
    </PageContainer>
  );
};

export default EvaluatorDashboardPage;
