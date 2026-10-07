'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Compass, KeyRound, LayoutDashboard, LogOut, Loader2, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';
import { ROLE_DASHBOARD_PATH } from '@/constants/routes';
import { useLogout, useGetMyProfile } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

const ROLE_LABEL = { DEVELOPER: 'Developer', EVALUATOR: 'Evaluator', ADMIN: 'Admin' } as const;

const getInitials = (value?: string | null) => {
  if (!value) return '?';
  const [name] = value.split('@');
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
};

const UserNav = () => {
  const router = useRouter();
  const { data: user, isPending } = useGetMyProfile();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully!');
        router.push('/login');
        // Drop every cached query, not just the profile, so the next account never sees this one's data.
        queryClient.removeQueries();
      },
      onError: () => {
        toast.error('Logout failed. Please try again.');
      },
    });
  };

  if (isPending) {
    return <div className='size-8 animate-pulse rounded-full bg-muted' />;
  }

  if (!user) {
    return (
      <Link href='/login' className={buttonVariants({ variant: 'ghost', size: 'lg' })}>
        Sign in
      </Link>
    );
  }

  const displayName = user.name ?? user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='Open account menu'
        className='rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
      >
        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt='' />}
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-60'>
        <DropdownMenuLabel className='flex flex-col gap-0.5'>
          <span className='truncate'>{displayName}</span>
          <span className='truncate text-xs font-normal text-muted-foreground'>
            {ROLE_LABEL[user.role]} · {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={ROLE_DASHBOARD_PATH[user.role]} />}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href='/profile' />}>
          <UserRound />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href='/change-password' />}>
          <KeyRound />
          Change password
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href='/assessments' />}>
          <Compass />
          Browse assessments
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          disabled={loggingOut}
          onClick={handleLogout}
          className='cursor-pointer'
        >
          {loggingOut ? <Loader2 className='animate-spin' /> : <LogOut />}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
