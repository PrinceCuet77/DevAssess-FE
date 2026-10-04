'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOut, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';
import { useLogout, useGetMyProfile } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

const getInitials = (value?: string | null) => {
  if (!value) return '?';
  const [name] = value.split('@');
  return name.slice(0, 2).toUpperCase();
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
        queryClient.removeQueries({ queryKey: ['my-profile'] });
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
      <Link
        href='/login'
        className={buttonVariants({ variant: 'ghost', size: 'lg' })}
      >
        Sign in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50'>
        <Avatar>
          <AvatarFallback>
            {getInitials(user.name ?? user.email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className='truncate'>
          {user.name ?? user.email}
        </DropdownMenuLabel>
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
