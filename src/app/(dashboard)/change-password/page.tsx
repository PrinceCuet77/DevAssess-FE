import type { Metadata } from 'next';
import { KeyRound } from 'lucide-react';
import PageContainer from '@/components/layout/dashboard/page-container';
import ChangePasswordForm from '@/components/form/change-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Change password | DevAssess',
};

const Page = () => {
  return (
    <PageContainer size='form' className='lg:py-12'>
      <Card>
        <CardHeader>
          <span className='mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <KeyRound className='size-6' />
          </span>
          <CardTitle className='font-heading text-2xl font-semibold tracking-tight'>
            Change password
          </CardTitle>
          <CardDescription>
            Enter your current password and choose a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Page;
