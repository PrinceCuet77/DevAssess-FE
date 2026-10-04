'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyProfile } from '@/hooks';
import { LOGIN_PATH } from '@/constants/routes';
import AuthLoading from './auth-loading';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isPending } = useGetMyProfile();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(LOGIN_PATH);
    }
  }, [isPending, user, router]);

  if (isPending) return <AuthLoading />;
  if (!user) return <AuthLoading label='Redirecting to sign in…' />;

  return <>{children}</>;
}
