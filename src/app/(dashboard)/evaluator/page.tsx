import type { Metadata } from 'next';
import EvaluatorDashboardView from '@/components/modules/evaluator-dashboard/evaluator-dashboard-view';

export const metadata: Metadata = {
  title: 'Evaluator dashboard - DevAssess',
};

const EvaluatorDashboardPage = () => {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Evaluator dashboard</h1>
        <p className='text-sm text-muted-foreground'>
          Track your assessments, sales and reviews.
        </p>
      </div>
      <EvaluatorDashboardView />
    </div>
  );
};

export default EvaluatorDashboardPage;
