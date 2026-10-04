import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Edit assessment - DevAssess',
};

const EvaluatorAssessmentsDetailEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Edit assessment'
      description='Update, publish or archive this assessment.'
      api='PATCH /evaluator/assessments/:id'
      resourceId={id}
    />
  );
};

export default EvaluatorAssessmentsDetailEditPage;
