import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Assessment details - DevAssess',
};

const DeveloperAssessmentsDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Assessment details'
      description='Review the assessment details and reviews before buying.'
      api='GET /assessments/:id'
      resourceId={id}
    />
  );
};

export default DeveloperAssessmentsDetailPage;
