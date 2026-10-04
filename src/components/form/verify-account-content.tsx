'use client';

import { redirect, useSearchParams } from 'next/navigation';
import VerifyAccountForm from '@/components/form/verify-account-form';

const VerifyAccountContent = () => {
  const email = useSearchParams().get('email');
  if (!email) redirect('/register');

  return <VerifyAccountForm email={email} />;
};

export default VerifyAccountContent;
