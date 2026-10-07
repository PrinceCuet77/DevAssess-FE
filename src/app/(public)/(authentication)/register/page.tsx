import type { Metadata } from 'next';
import AuthBrandPanel from '@/components/modules/auth/brand-panel';
import RegisterForm from '@/components/form/register-form';

export const metadata: Metadata = {
  title: 'Create an account | DevAssess',
  description: 'Join DevAssess to buy and take assessments, or publish assessments as an evaluator.',
};

const RegisterPage = () => {
  return (
    <>
      <AuthBrandPanel
        title='Prove it. Get hired for it.'
        description='Join the marketplace as a developer taking real assessments, or an evaluator publishing and selling your own.'
      />

      <div className='flex items-center justify-center px-4 py-10 sm:px-6'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 space-y-1.5'>
            <h1 className='font-heading text-2xl font-semibold tracking-tight'>Create your account</h1>
            <p className='text-sm text-muted-foreground'>
              Start buying, taking, or publishing assessments in minutes.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
