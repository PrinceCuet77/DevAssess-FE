import type { Metadata } from 'next';
import AuthBrandPanel from '@/components/modules/auth/brand-panel';
import LoginForm from '@/components/form/login-form';

export const metadata: Metadata = {
  title: 'Sign in | DevAssess',
  description: 'Sign in to your DevAssess account to buy, take, or manage technical assessments.',
};

const LoginPage = () => {
  return (
    <>
      <AuthBrandPanel />

      <div className='flex items-center justify-center px-4 py-10 sm:px-6'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 space-y-1.5'>
            <h1 className='font-heading text-2xl font-semibold tracking-tight'>Welcome back</h1>
            <p className='text-sm text-muted-foreground'>
              Sign in to buy, take, or manage your assessments.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
