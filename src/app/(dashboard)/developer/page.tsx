import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import DeveloperDashboardView from '@/components/modules/developer-dashboard/developer-dashboard-view';

export const metadata: Metadata = {
  title: 'Developer dashboard | DevAssess',
};

const DeveloperDashboardPage = () => {
  return (
    <PageContainer>
      <PageHeader title='Developer dashboard' description='Track your assessments, attempts and results.' />
      <DeveloperDashboardView />
    </PageContainer>
  );
};

export default DeveloperDashboardPage;
