import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Browse assessments - DevAssess',
};

const DeveloperAssessmentsPage = () => {
  return (
    <PlaceholderPage
      title='Browse assessments'
      description='Search and filter assessments published by evaluators.'
      api='GET /assessments'
    />
  );
};

export default DeveloperAssessmentsPage;
