import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evaluator dashboard - DevAssess',
};

const EvaluatorDashboardPage = () => {
  return (
    <div className='mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <h1 className='font-heading text-2xl font-semibold tracking-tight'>Evaluator dashboard</h1>
    </div>
  );
};

export default EvaluatorDashboardPage;
