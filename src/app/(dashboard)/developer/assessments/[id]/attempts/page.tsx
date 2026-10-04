import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Attempts - DevAssess',
};

const DeveloperAssessmentsDetailAttemptsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Attempts'
      description='Your past attempts for this assessment.'
      api='GET /developer/assessments/:id/attempts'
      resourceId={id}
    />
  );
};

export default DeveloperAssessmentsDetailAttemptsPage;
