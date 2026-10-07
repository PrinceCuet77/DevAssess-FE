import { Suspense } from 'react';
import type { Metadata } from 'next';
import PublicAssessmentDetailView from '@/components/modules/public-assessments/public-assessment-detail-view';

// The view swaps in the assessment's own title once it loads.
export const metadata: Metadata = {
  title: 'Assessment | DevAssess',
};

const AssessmentDetailPage = () => (
  <Suspense>
    <PublicAssessmentDetailView />
  </Suspense>
);

export default AssessmentDetailPage;
