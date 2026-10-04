import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Assessment details - DevAssess',
};

const AdminAssessmentsDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Assessment details'
      description='Details of this assessment.'
      api='GET /evaluator/assessments/:id'
      resourceId={id}
    />
  );
};

export default AdminAssessmentsDetailPage;
