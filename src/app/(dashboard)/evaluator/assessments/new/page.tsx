import type { Metadata } from 'next';
import CreateAssessmentView from '@/components/modules/evaluator-assessment-create/create-assessment-view';

export const metadata: Metadata = {
  title: 'New assessment - DevAssess',
};

const EvaluatorAssessmentsNewPage = () => {
  return <CreateAssessmentView />;
};

export default EvaluatorAssessmentsNewPage;
