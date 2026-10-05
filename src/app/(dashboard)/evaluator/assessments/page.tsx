import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import EvaluatorAssessmentsView, {
  NewAssessmentButton,
} from '@/components/modules/evaluator-assessments/evaluator-assessments-view';
import { AssessmentsTableSkeleton } from '@/components/modules/evaluator-assessments/assessments-table';

export const metadata: Metadata = {
  title: 'My assessments - DevAssess',
};

const EvaluatorAssessmentsPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title='My assessments'
        description='Create, publish and manage the assessments you sell.'
        actions={<NewAssessmentButton />}
      />
      <Suspense fallback={<AssessmentsTableSkeleton />}>
        <EvaluatorAssessmentsView />
      </Suspense>
    </PageContainer>
  );
};

export default EvaluatorAssessmentsPage;
