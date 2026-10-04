import { Suspense } from 'react';
import type { Metadata } from 'next';
import EvaluatorAssessmentsView, {
  NewAssessmentButton,
} from '@/components/modules/evaluator-assessments/evaluator-assessments-view';
import { AssessmentsTableSkeleton } from '@/components/modules/evaluator-assessments/assessments-table';

export const metadata: Metadata = {
  title: 'My assessments - DevAssess',
};

const EvaluatorAssessmentsPage = () => {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6 flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='font-heading text-2xl font-semibold tracking-tight'>My assessments</h1>
          <p className='text-sm text-muted-foreground'>
            Create, publish and manage the assessments you sell.
          </p>
        </div>
        <NewAssessmentButton />
      </div>
      <Suspense fallback={<AssessmentsTableSkeleton />}>
        <EvaluatorAssessmentsView />
      </Suspense>
    </div>
  );
};

export default EvaluatorAssessmentsPage;
