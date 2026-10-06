import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import DeveloperReviewsView from '@/components/modules/developer-reviews/developer-reviews-view';
import ReviewsSkeleton from '@/components/modules/developer-reviews/reviews-skeleton';

export const metadata: Metadata = {
  title: 'My reviews - DevAssess',
};

const DeveloperReviewsPage = () => (
  <PageContainer>
    <PageHeader title='My reviews' description='The ratings and feedback you have shared on assessments.' />
    <Suspense fallback={<ReviewsSkeleton />}>
      <DeveloperReviewsView />
    </Suspense>
  </PageContainer>
);

export default DeveloperReviewsPage;
