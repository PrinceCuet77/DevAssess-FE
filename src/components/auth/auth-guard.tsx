'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyProfile } from '@/hooks';
import { currentPath, loginHref } from '@/lib/redirect';
import AuthLoading from './auth-loading';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isPending } = useGetMyProfile();

  useEffect(() => {
    if (!isPending && !user) {
      // Come back here after signing in (e.g. the payment gateway landing page after a lost session).
      router.replace(loginHref(currentPath()));
    }
  }, [isPending, user, router]);

  if (isPending) return <AuthLoading />;
  if (!user) return <AuthLoading label='Redirecting to sign in…' />;

  return <>{children}</>;
}
