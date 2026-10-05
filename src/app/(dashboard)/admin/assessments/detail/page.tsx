'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/dashboard/page-container';
import AdminAssessmentDetailView from '@/components/modules/admin-assessments/admin-assessment-detail-view';

const AssessmentDetail = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return <AdminAssessmentDetailView assessmentId={id} />;
};

const AdminAssessmentsDetailPage = () => (
  <PageContainer>
    <Suspense>
      <AssessmentDetail />
    </Suspense>
  </PageContainer>
);

export default AdminAssessmentsDetailPage;
