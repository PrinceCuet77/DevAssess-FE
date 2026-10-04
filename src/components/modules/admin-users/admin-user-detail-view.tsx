'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ClipboardList,
  Receipt,
  ShieldAlert,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { FetchError } from 'ofetch';
import UserAvatar from '@/components/modules/admin-users/user-avatar';
import {
  RoleBadge,
  StatusBadge,
} from '@/components/modules/admin-users/user-badges';
import UserStatusActions from '@/components/modules/admin-users/user-status-actions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAdminUser } from '@/hooks';
import type { AdminUserDetail } from '@/types/admin-users.types';

const PROVIDER_LABEL = {
  CREDENTIALS: 'Email / Password',
  GOOGLE: 'Google',
} as const;

const Stat = ({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) => (
  <Card size='sm'>
    <CardContent className='flex items-center justify-between gap-3'>
      <div>
        <p className='text-xs text-muted-foreground'>{label}</p>
        <p className='font-heading text-2xl font-semibold tabular-nums'>{value}</p>
      </div>
      <span className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
        <Icon className='size-4' />
      </span>
    </CardContent>
  </Card>
);

const statsFor = (user: AdminUserDetail) => {
  const c = user._count;
  if (user.role === 'EVALUATOR')
    return [{ label: 'Assessments created', value: c.assessments, icon: ClipboardList }];
  if (user.role === 'DEVELOPER')
    return [
      { label: 'Orders', value: c.purchaseAssessments, icon: Receipt },
      { label: 'Attempts', value: c.attempts, icon: ClipboardList },
      { label: 'Reviews', value: c.reviews, icon: Star },
    ];
  return [];
};

const Skeletons = () => (
  <div className='flex flex-col gap-6'>
    <Skeleton className='h-24 w-full' />
    <Skeleton className='h-40 w-full' />
  </div>
);

const AdminUserDetailView = ({ userId }: { userId: string }) => {
  const { data: user, isPending, error } = useGetAdminUser(userId);

  const back = (
    <Link
      href='/admin/users'
      className='mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
    >
      <ArrowLeft className='size-4' /> Back to users
    </Link>
  );

  if (isPending) return <Skeletons />;

  if (!user) {
    if (
      error instanceof FetchError &&
      (error.status === 404 || error.status === 400)
    )
      notFound();
    return (
      <>
        {back}
        <Card>
          <CardContent className='py-6 text-center text-sm text-muted-foreground'>
            We couldn&apos;t load this user.
          </CardContent>
        </Card>
      </>
    );
  }

  const deleted = user.status === 'DELETED' || user.deletedAt !== null;
  const stats = statsFor(user);

  return (
    <>
      {back}
      <div className='flex flex-col gap-6'>
        {(user.status === 'SUSPENDED' || deleted) && (
          <div
            role='status'
            className='flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'
          >
            <ShieldAlert className='mt-0.5 size-4 shrink-0 text-destructive' />
            <p>
              {deleted
                ? 'This account is deleted. Restoring it will reinstate it as verified.'
                : 'This account is suspended and cannot log in or use the platform.'}
            </p>
          </div>
        )}
        <Card className='overflow-hidden pt-0'>
          <div className='h-24 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-sky-500/30' />
          <CardContent className='-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end'>
            <UserAvatar {...user} className='size-24 text-2xl ring-4' />
            <div className='min-w-0 flex-1 space-y-2'>
              <div>
                <h2 className='truncate font-heading text-xl font-semibold'>
                  {user.name ?? user.email}
                </h2>
                {user.name && (
                  <p className='truncate text-sm text-muted-foreground'>
                    {user.email}
                  </p>
                )}
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
                {deleted && <Badge variant='secondary'>Deleted</Badge>}
                {user.auths.map((a) => (
                  <Badge key={a.id} variant='outline'>
                    {PROVIDER_LABEL[a.provider]}
                  </Badge>
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-3 sm:items-end'>
              <UserStatusActions user={user} variant='button' />
              <div className='text-sm text-muted-foreground sm:text-right'>
                <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Updated {new Date(user.updatedAt).toLocaleDateString()}</p>
                {user.deletedAt && (
                  <p>Deleted {new Date(user.deletedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {stats.length > 0 && (
          <div className='grid gap-4 sm:grid-cols-3'>
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-sm'>
            <p className={user.bio ? '' : 'text-muted-foreground'}>
              {user.bio ?? 'No bio provided.'}
            </p>
            <dl className='grid gap-3 sm:grid-cols-3'>
              {[
                ['Profession', user.profession],
                ['Company', user.company],
                [
                  'Experience',
                  `${user.experience} ${user.experience === 1 ? 'year' : 'years'}`,
                ],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className='text-xs text-muted-foreground'>{term}</dt>
                  <dd className='font-medium'>{value || 'N/A'}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className='mb-2 text-xs text-muted-foreground'>Skills</p>
              {user.skills.length === 0 ? (
                <p className='text-muted-foreground'>No skills listed.</p>
              ) : (
                <div className='flex flex-wrap gap-1.5'>
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant='secondary'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminUserDetailView;
