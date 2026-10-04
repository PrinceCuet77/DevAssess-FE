import type { Metadata } from 'next';
import PlaceholderPage from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Review - DevAssess',
};

const DeveloperReviewsDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <PlaceholderPage
      title='Review'
      description='View, edit or delete this review.'
      api='GET/PATCH/DELETE /reviews/:id'
      resourceId={id}
    />
  );
};

export default DeveloperReviewsDetailPage;
