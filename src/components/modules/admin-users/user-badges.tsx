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

export const RoleBadge = ({ role }: { role: UserRole }) => (
  <Badge variant={role === 'ADMIN' ? 'default' : 'outline'}>{label(role)}</Badge>
);
