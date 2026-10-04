import { ClipboardCheck, Code2, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { UserRole, UserStatus } from '@/types/admin-dashboard.types';

const STATUS_VARIANT: Record<UserStatus, 'success' | 'warning' | 'secondary' | 'destructive'> = {
  VERIFIED: 'success',
  NOT_VERIFIED: 'warning',
  SUSPENDED: 'destructive',
  DELETED: 'secondary',
};

export const label = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase().replaceAll('_', ' ');

export const StatusBadge = ({ status }: { status: UserStatus }) => (
  <Badge variant={STATUS_VARIANT[status]}>{label(status)}</Badge>
);

const ROLE_STYLE: Record<UserRole, { icon: LucideIcon; className: string }> = {
  ADMIN: {
    icon: ShieldCheck,
    className:
      'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  },
  EVALUATOR: {
    icon: ClipboardCheck,
    className: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  },
  DEVELOPER: {
    icon: Code2,
    className:
      'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300',
  },
};

export const RoleBadge = ({ role }: { role: UserRole }) => {
  const { icon: Icon, className } = ROLE_STYLE[role];
  return (
    <Badge variant='outline' className={className}>
      <Icon className='size-3' aria-hidden />
      {label(role)}
    </Badge>
  );
};
