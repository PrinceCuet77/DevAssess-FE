import { Suspense } from 'react';
import type { Metadata } from 'next';
import AuthBrandPanel from '@/components/modules/auth/brand-panel';
import VerifyAccountContent from '@/components/form/verify-account-content';

export const metadata: Metadata = {
  title: 'Verify your account - DevAssess',
  description:
    'Enter the one-time code we emailed you to verify your DevAssess account.',
};

const VerifyAccountPage = () => (
  <>
    <AuthBrandPanel />

    <div className='flex items-center justify-center px-4 py-10 sm:px-6'>
      <div className='w-full max-w-sm'>
        <Suspense fallback={null}>
          <VerifyAccountContent />
        </Suspense>
      </div>
    </div>
  </>
);

export default VerifyAccountPage;
