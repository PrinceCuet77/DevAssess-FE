'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getMyProfile } from '@/api/user.api';

// The API redirects here after setting the auth cookies; the URL carries no data.
const AuthSuccessPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    getMyProfile()
      .then((response) => {
        if (cancelled) return;
        queryClient.setQueryData(['user'], response);
        toast.success('Login successful!');
        router.replace('/');
      })
      .catch(() => {
        if (cancelled) return;
        toast.error('Google sign-in failed. Please try again.');
        router.replace('/login');
      });

    return () => {
      cancelled = true;
    };
  }, [router, queryClient]);

  return (
    <main className='flex min-h-svh items-center justify-center gap-2 text-sm text-muted-foreground'>
      <Loader2 className='size-4 animate-spin' />
      Signing you in…
    </main>
  );
};

export default AuthSuccessPage;
