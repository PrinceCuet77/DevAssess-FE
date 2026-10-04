import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'My assessments - DevAssess',
};

const DeveloperMyAssessmentsPage = () => {
  return (
    <PlaceholderPage
      title='My assessments'
      description='Assessments you have purchased and can take.'
      api='Derived from paid purchases'
    />
  );
};

export default DeveloperMyAssessmentsPage;
