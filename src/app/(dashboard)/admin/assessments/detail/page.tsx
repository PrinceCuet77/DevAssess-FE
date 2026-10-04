'use client';

import { Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import AdminAssessmentDetailView from '@/components/modules/admin-assessments/admin-assessment-detail-view';

const AssessmentDetail = () => {
  const id = useSearchParams().get('id');
  if (!id) notFound();

  return <AdminAssessmentDetailView assessmentId={id} />;
};

const AdminAssessmentsDetailPage = () => (
  <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
    <Suspense>
      <AssessmentDetail />
    </Suspense>
  </div>
);

export default AdminAssessmentsDetailPage;
