import type { Metadata } from 'next';
import PageContainer from '@/components/layout/dashboard/page-container';
import PageHeader from '@/components/layout/dashboard/page-header';
import ProfileView from '@/components/modules/profile/profile-view';

export const metadata: Metadata = {
  title: 'Update profile - DevAssess',
};

const Page = () => {
  return (
    <PageContainer>
      <PageHeader
        title='Update profile'
        description='Manage your photo, personal details and account.'
      />
      <ProfileView />
    </PageContainer>
  );
};

export default Page;
