import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'My assessments - DevAssess',
};

const EvaluatorAssessmentsPage = () => {
  return (
    <PlaceholderPage
      title='My assessments'
      description='Manage the assessments you have published.'
      api='GET /evaluator/assessments'
    />
  );
};

export default EvaluatorAssessmentsPage;
