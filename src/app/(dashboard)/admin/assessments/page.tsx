import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Assessments - DevAssess',
};

const AdminAssessmentsPage = () => {
  return (
    <PlaceholderPage
      title='Assessments'
      description='All assessments, including drafts, archived and deleted.'
      api='GET /admin/assessments'
    />
  );
};

export default AdminAssessmentsPage;
