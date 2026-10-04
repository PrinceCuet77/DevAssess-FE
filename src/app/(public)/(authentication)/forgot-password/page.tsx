import type { Metadata } from 'next';
import AuthBrandPanel from '@/components/modules/auth/brand-panel';
import ForgotPasswordForm from '@/components/form/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot password - DevAssess',
  description: 'Reset the password for your DevAssess account.',
};

const ForgotPasswordPage = () => {
  return (
    <>
      <AuthBrandPanel
        title='Forgot your password? Happens to the best of us.'
        description="Enter the email you signed up with and we'll send you a one-time code to get back into your account."
      />

      <div className='flex items-center justify-center px-4 py-10 sm:px-6'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 space-y-1.5'>
            <h1 className='font-heading text-2xl font-semibold tracking-tight'>
              Reset your password
            </h1>
            <p className='text-sm text-muted-foreground'>
              We&apos;ll email you a one-time code to set a new password.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
