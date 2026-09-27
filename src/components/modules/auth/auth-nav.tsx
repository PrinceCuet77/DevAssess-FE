'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

const AuthNav = () => {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <div className='flex items-center gap-2'>
      {isLogin ? (
        <Link href='/register' className={buttonVariants({ variant: 'outline' })}>
          Create account
        </Link>
      ) : (
        <Link href='/login' className={buttonVariants({ variant: 'outline' })}>
          Sign in
        </Link>
      )}
    </div>
  );
};

export default AuthNav;
