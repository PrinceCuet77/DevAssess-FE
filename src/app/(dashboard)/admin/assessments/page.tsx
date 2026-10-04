import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminAssessmentsView from '@/components/modules/admin-assessments/admin-assessments-view';
import { AssessmentsTableSkeleton } from '@/components/modules/admin-assessments/assessments-table';

export const metadata: Metadata = {
  title: 'Assessments - DevAssess',
};

const AdminAssessmentsPage = () => {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Assessments</h1>
        <p className='text-sm text-muted-foreground'>
          All assessments, including drafts, archived and deleted.
        </p>
      </div>
      <Suspense fallback={<AssessmentsTableSkeleton />}>
        <AdminAssessmentsView />
      </Suspense>
    </div>
  );
};

export default AdminAssessmentsPage;
