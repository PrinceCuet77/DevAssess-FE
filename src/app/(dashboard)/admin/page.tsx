import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import AdminDashboardView from '@/components/modules/admin-dashboard/admin-dashboard-view';

export const metadata: Metadata = {
  title: 'Admin dashboard - DevAssess',
};

const AdminDashboardPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title='Admin dashboard'
        description='Oversee users, assessments and orders across the marketplace.'
      />
      <AdminDashboardView />
    </PageContainer>
  );
};

export default AdminDashboardPage;
