import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import AdminAnalyticsView from '@/components/modules/admin-dashboard/admin-analytics-view';

export const metadata: Metadata = {
  title: 'Analytics | DevAssess',
};

const AdminAnalyticsPage = () => (
  <PageContainer>
    <PageHeader
      title='Analytics'
      description='Breakdowns of users, assessments and attempts across the marketplace.'
    />
    <AdminAnalyticsView />
  </PageContainer>
);

export default AdminAnalyticsPage;
