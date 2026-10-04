import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'New assessment - DevAssess',
};

const EvaluatorAssessmentsNewPage = () => {
  return (
    <PlaceholderPage
      title='New assessment'
      description='Create a new assessment.'
      api='POST /evaluator/assessment'
    />
  );
};

export default EvaluatorAssessmentsNewPage;
