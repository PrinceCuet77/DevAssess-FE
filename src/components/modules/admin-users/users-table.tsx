import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/modules/admin-users/user-avatar';
import {
  RoleBadge,
  StatusBadge,
} from '@/components/modules/admin-users/user-badges';
import UserStatusActions from '@/components/modules/admin-users/user-status-actions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AdminUserRow } from '@/types/admin-users.types';

const HEAD = 'px-4 py-2.5 text-left text-xs font-medium text-muted-foreground';

export const UsersTableSkeleton = () => (
  <div className='flex flex-col divide-y divide-border/60'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className='flex items-center gap-3 px-4 py-4'>
        <Skeleton className='size-10 rounded-full' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-40' />
          <Skeleton className='h-3 w-56' />
        </div>
        <Skeleton className='h-5 w-16' />
      </div>
    ))}
  </div>
);

const UsersTable = ({ users }: { users: AdminUserRow[] }) => (
  <div className='overflow-x-auto'>
    <table className='w-full min-w-[900px] text-sm'>
      <thead className='border-b border-border/60 bg-muted/30'>
        <tr>
          <th className={HEAD}>User</th>
          <th className={HEAD}>Role</th>
          <th className={HEAD}>Status</th>
          <th className={HEAD}>Work</th>
          <th className={HEAD}>Activity</th>
          <th className={HEAD}>Joined</th>
          <th className={`${HEAD} w-12 text-right`}>
            <span className='sr-only'>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className='divide-y divide-border/60'>
        {users.map((user) => {
          const deleted = user.status === 'DELETED' || user.deletedAt !== null;
          const work = [user.profession, user.company]
            .filter(Boolean)
            .join(' · ');
          return (
            <tr
              key={user.id}
              className={cn('hover:bg-muted/40', deleted && 'opacity-60')}
            >
              <td className='px-4 py-4'>
                <Link
                  href={`/admin/users/detail?id=${user.id}`}
                  className='flex items-center gap-3'
                >
                  <UserAvatar {...user} />
                  <span className='min-w-0'>
                    <span className='flex items-center gap-2 font-medium'>
                      <span className='truncate'>
                        {user.name ?? user.email}
                      </span>
                      {deleted && <Badge variant='secondary'>Deleted</Badge>}
                    </span>
                    {user.name && (
                      <span className='block truncate text-xs text-muted-foreground'>
                        {user.email}
                      </span>
                    )}
                  </span>
                </Link>
              </td>
              <td className='px-4 py-4'>
                <RoleBadge role={user.role} />
              </td>
              <td className='px-4 py-4'>
                <StatusBadge status={user.status} />
              </td>
              <td className='px-4 py-4 text-muted-foreground'>
                {work || 'N/A'}
              </td>
              <td className='px-4 py-4'>
                {user.role === 'EVALUATOR' ? (
                  <p className='font-medium tabular-nums'>{user._count.assessments} assessments</p>
                ) : (
                  <>
                    <p className='font-medium tabular-nums'>
                      {user._count.purchaseAssessments}{' '}
                      {user._count.purchaseAssessments === 1 ? 'order' : 'orders'}
                    </p>
                    <p className='text-xs text-muted-foreground tabular-nums'>
                      {user._count.attempts} attempts · {user._count.reviews} reviews
                    </p>
                  </>
                )}
              </td>
              <td className='px-4 py-4 text-muted-foreground'>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className='px-2 py-4 text-right'>
                <UserStatusActions user={user} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default UsersTable;
