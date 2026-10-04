'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  CircleCheck,
  Loader2,
  MailQuestion,
  MoreHorizontal,
  RotateCcw,
  ShieldBan,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { StatusBadge } from '@/components/modules/admin-users/user-badges';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetMyProfile, useUpdateAdminUserStatus } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/utils';
import type { UserRole, UserStatus } from '@/types/admin-dashboard.types';
import type { AdminSettableStatus } from '@/types/admin-users.types';

type StatusActionUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
};

type StatusAction = {
  status: AdminSettableStatus;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
};

const SUSPEND: StatusAction = {
  status: 'SUSPENDED',
  label: 'Suspend user',
  icon: ShieldBan,
  title: 'Suspend this user?',
  description:
    'They will be blocked on their next request and will not be able to log in until restored.',
  confirmLabel: 'Suspend user',
  destructive: true,
};

const VERIFY: StatusAction = {
  status: 'VERIFIED',
  label: 'Mark as verified',
  icon: ShieldCheck,
  title: 'Verify this user?',
  description: 'The account will be marked as verified.',
  confirmLabel: 'Verify user',
};

const RESTORE_SUSPENDED: StatusAction = {
  status: 'VERIFIED',
  label: 'Restore access',
  icon: RotateCcw,
  title: 'Restore this user?',
  description: 'The suspension will be lifted and the user can log in again.',
  confirmLabel: 'Restore access',
};

const RESTORE_DELETED: StatusAction = {
  ...RESTORE_SUSPENDED,
  label: 'Restore account',
  title: 'Restore this deleted account?',
  description:
    'The account will be reinstated as verified and the user will regain access to their data.',
  confirmLabel: 'Restore account',
};

const UNVERIFY: StatusAction = {
  status: 'NOT_VERIFIED',
  label: 'Mark as unverified',
  icon: MailQuestion,
  title: 'Mark as unverified?',
  description: 'The account will be flagged as not verified.',
  confirmLabel: 'Mark unverified',
};

// Only transitions that make sense from the current state are offered.
const ACTIONS: Record<UserStatus, StatusAction[]> = {
  VERIFIED: [SUSPEND, UNVERIFY],
  NOT_VERIFIED: [VERIFY, SUSPEND],
  SUSPENDED: [RESTORE_SUSPENDED, UNVERIFY],
  DELETED: [RESTORE_DELETED],
};

type IProps = {
  user: StatusActionUser;
  // `icon` is a compact row trigger; `button` is a labelled trigger for page headers.
  variant?: 'icon' | 'button';
};

const UserStatusActions = ({ user, variant = 'icon' }: IProps) => {
  const { data: me } = useGetMyProfile();
  const { mutate, isPending } = useUpdateAdminUserStatus();
  const [selected, setSelected] = useState<StatusAction | null>(null);

  const displayName = user.name ?? user.email;
  const isSelf = me?.id === user.id;
  // The API has no self/admin protection, so guard in the UI.
  const locked = isSelf || user.role === 'ADMIN';
  const lockedReason = isSelf
    ? 'You can’t change your own status'
    : 'Admin accounts can’t be changed here';

  if (locked) {
    return (
      <Button
        variant='ghost'
        size={variant === 'icon' ? 'icon' : 'default'}
        disabled
        title={lockedReason}
        aria-label={lockedReason}
      >
        {variant === 'icon' ? <MoreHorizontal /> : 'Manage status'}
      </Button>
    );
  }

  const confirm = () => {
    if (!selected) return;
    mutate(
      { userId: user.id, status: selected.status },
      {
        onSuccess: () => {
          toast.success(`${displayName} updated.`);
          setSelected(null);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Could not update status.')),
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            variant === 'icon' ? (
              <Button variant='ghost' size='icon' aria-label={`Manage ${displayName}`} />
            ) : (
              <Button variant='outline' />
            )
          }
        >
          {variant === 'icon' ? <MoreHorizontal /> : 'Manage status'}
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-48'>
          <DropdownMenuLabel className='flex items-center gap-2'>
            Current <StatusBadge status={user.status} />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ACTIONS[user.status].map((action) => (
            <DropdownMenuItem
              key={action.label}
              variant={action.destructive ? 'destructive' : 'default'}
              className='cursor-pointer'
              onClick={() => setSelected(action)}
            >
              <action.icon />
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={selected !== null}
        onOpenChange={(next) => {
          if (!next && !isPending) setSelected(null);
        }}
      >
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <span
                  className={cn(
                    'mb-1 flex size-10 items-center justify-center rounded-full',
                    selected.destructive
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-primary/10 text-primary',
                  )}
                >
                  <selected.icon className='size-5' />
                </span>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>
              <div className='flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2 text-sm'>
                <span className='min-w-0'>
                  <span className='block truncate font-medium'>{displayName}</span>
                  {user.name && (
                    <span className='block truncate text-xs text-muted-foreground'>{user.email}</span>
                  )}
                </span>
                <span className='flex shrink-0 items-center gap-1.5 text-muted-foreground'>
                  <StatusBadge status={user.status} />→<StatusBadge status={selected.status} />
                </span>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant='outline' disabled={isPending} />}>
                  Cancel
                </DialogClose>
                <Button
                  variant={selected.destructive ? 'destructive' : 'default'}
                  disabled={isPending}
                  onClick={confirm}
                >
                  {isPending ? <Loader2 className='animate-spin' /> : <CircleCheck />}
                  {selected.confirmLabel}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserStatusActions;
