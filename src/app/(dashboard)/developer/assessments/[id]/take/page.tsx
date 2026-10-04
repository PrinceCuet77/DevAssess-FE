import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Take assessment - DevAssess',
};

const DeveloperAssessmentsDetailTakePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Take assessment'
      description='Start your attempt and submit your answers.'
      api='GET /developer/assessments/:id/start'
      resourceId={id}
    />
  );
};

export default DeveloperAssessmentsDetailTakePage;
