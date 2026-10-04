import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ROLE_DASHBOARD_PATH } from '@/constants/routes';
import type { Role } from '@/types/user.types';

export default function AccessDenied({ role }: { role?: Role }) {
  const href = role ? ROLE_DASHBOARD_PATH[role] : '/';

  return (
    <div className='flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center px-4'>
      <div className='flex max-w-md flex-col items-center gap-4 text-center'>
        <span className='flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
          <ShieldAlert className='size-7' />
        </span>
        <div className='space-y-1.5'>
          <h1 className='font-heading text-2xl font-semibold tracking-tight'>Access denied</h1>
          <p className='text-balance text-sm text-muted-foreground'>
            You don&apos;t have permission to view this page. If you think this is a mistake, try
            signing in with a different account.
          </p>
        </div>
        <Link href={href} className={buttonVariants({ size: 'lg' })}>
          {role ? 'Go to my dashboard' : 'Go home'}
        </Link>
      </div>
    </div>
  );
}
