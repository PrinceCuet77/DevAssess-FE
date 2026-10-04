import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Assessment details - DevAssess',
};

const EvaluatorAssessmentsDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Assessment details'
      description='Details of your assessment.'
      api='GET /evaluator/assessments/:id'
      resourceId={id}
    />
  );
};

export default EvaluatorAssessmentsDetailPage;
