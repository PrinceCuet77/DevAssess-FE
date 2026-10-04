import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'My reviews - DevAssess',
};

const DeveloperReviewsPage = () => {
  return (
    <PlaceholderPage
      title='My reviews'
      description='Reviews you have written.'
      api='GET /reviews'
    />
  );
};

export default DeveloperReviewsPage;
