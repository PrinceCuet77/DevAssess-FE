import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import OwnedAssessmentsSkeleton from '@/components/modules/developer-assessments/owned-assessments-skeleton';
import OwnedAssessmentsView from '@/components/modules/developer-assessments/owned-assessments-view';

export const metadata: Metadata = {
  title: 'My assessments - DevAssess',
};

const DeveloperMyAssessmentsPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title='My assessments'
        description='Assessments you have purchased. Start one whenever you are ready; retakes are allowed.'
      />
      <Suspense fallback={<OwnedAssessmentsSkeleton />}>
        <OwnedAssessmentsView />
      </Suspense>
    </PageContainer>
  );
};

export default DeveloperMyAssessmentsPage;
