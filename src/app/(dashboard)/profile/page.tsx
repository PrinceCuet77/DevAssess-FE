import type { Metadata } from 'next';
import ProfileView from '@/components/modules/profile/profile-view';

export const metadata: Metadata = {
  title: 'Update profile - DevAssess',
};

const Page = () => {
  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Update profile</h1>
        <p className='text-sm text-muted-foreground'>Manage your photo, personal details and account.</p>
      </div>
      <ProfileView />
    </div>
  );
};

export default Page;
