import type { Metadata } from 'next';
import Link from 'next/link';
import AuthBrandPanel from '@/components/modules/auth/brand-panel';
import LoginForm from '@/components/form/login-form';

export const metadata: Metadata = {
  title: 'Sign in — DevAssess',
  description: 'Sign in to your DevAssess account to buy, take, or manage technical assessments.',
};

const LoginPage = () => {
  return (
    <main className='grid min-h-svh lg:grid-cols-2'>
      <AuthBrandPanel />

      <div className='flex items-center justify-center px-4 py-12 sm:px-6'>
        <div className='w-full max-w-sm'>
          <Link
            href='/'
            className='mb-10 flex justify-center font-heading text-xl font-semibold lg:hidden'
          >
            DevAssess
          </Link>

          <div className='mb-8 space-y-1.5'>
            <h1 className='font-heading text-2xl font-semibold tracking-tight'>Welcome back</h1>
            <p className='text-sm text-muted-foreground'>
              Sign in to buy, take, or manage your assessments.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
