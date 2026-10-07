import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import AdminAssessmentsView from '@/components/modules/admin-assessments/admin-assessments-view';
import { AssessmentsTableSkeleton } from '@/components/modules/admin-assessments/assessments-table';

export const metadata: Metadata = {
  title: 'Assessments | DevAssess',
};

const AdminAssessmentsPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title='Assessments'
        description='All assessments, including drafts, archived and deleted.'
      />
      <Suspense fallback={<AssessmentsTableSkeleton />}>
        <AdminAssessmentsView />
      </Suspense>
    </PageContainer>
  );
};

export default AdminAssessmentsPage;
