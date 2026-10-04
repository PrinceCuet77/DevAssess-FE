import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthBrandPanel from '@/components/modules/auth/brand-panel';
import VerifyAccountForm from '@/components/form/verify-account-form';

export const metadata: Metadata = {
  title: 'Verify your account - DevAssess',
  description: 'Enter the one-time code we emailed you to verify your DevAssess account.',
};

const VerifyAccountPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) => {
  const { email } = await searchParams;
  if (!email) redirect('/register');

  return (
    <>
      <AuthBrandPanel />

      <div className='flex items-center justify-center px-4 py-10 sm:px-6'>
        <div className='w-full max-w-sm'>
          <VerifyAccountForm email={email} />
        </div>
      </div>
    </>
  );
};

export default VerifyAccountPage;
