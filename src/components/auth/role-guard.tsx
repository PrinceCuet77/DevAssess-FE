'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyProfile } from '@/hooks';
import { LOGIN_PATH } from '@/constants/routes';
import type { Role } from '@/types/user.types';
import AuthLoading from './auth-loading';
import AccessDenied from './access-denied';

interface IProps {
  children: ReactNode;
  roles: Role[];
}

export default function RoleGuard({ children, roles }: IProps) {
  const router = useRouter();
  const { data: user, isPending } = useGetMyProfile();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(LOGIN_PATH);
    }
  }, [isPending, user, router]);

  if (isPending) return <AuthLoading />;
  if (!user) return <AuthLoading label='Redirecting to sign in…' />;
  if (!roles.includes(user.role)) return <AccessDenied role={user.role} />;

  return <>{children}</>;
}
