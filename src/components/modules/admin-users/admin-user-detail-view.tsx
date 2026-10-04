'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FetchError } from 'ofetch';
import UserAvatar from '@/components/modules/admin-users/user-avatar';
import { RoleBadge, StatusBadge } from '@/components/modules/admin-users/user-badges';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAdminUser } from '@/hooks';
import type { AdminUserDetail } from '@/types/admin-users.types';

const PROVIDER_LABEL = { CREDENTIALS: 'Email / Password', GOOGLE: 'Google' } as const;

const Stat = ({ label, value }: { label: string; value: number }) => (
  <Card size='sm'>
    <CardContent>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='font-heading text-2xl font-semibold'>{value}</p>
    </CardContent>
  </Card>
);

const statsFor = (user: AdminUserDetail) => {
  const c = user._count;
  if (user.role === 'EVALUATOR') return [{ label: 'Assessments created', value: c.assessments }];
  if (user.role === 'DEVELOPER')
    return [
      { label: 'Orders', value: c.purchaseAssessments },
      { label: 'Attempts', value: c.attempts },
      { label: 'Reviews', value: c.reviews },
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
    const notFound =
      error instanceof FetchError && (error.status === 404 || error.status === 400);
    return (
      <>
        {back}
        <Card>
          <CardContent className='py-6 text-center text-sm text-muted-foreground'>
            {notFound ? 'This user could not be found.' : "We couldn't load this user."}
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
        <Card>
          <CardContent className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <UserAvatar {...user} className='size-16' />
            <div className='min-w-0 flex-1 space-y-2'>
              <div>
                <h2 className='truncate font-heading text-xl font-semibold'>
                  {user.name ?? user.email}
                </h2>
                {user.name && <p className='truncate text-sm text-muted-foreground'>{user.email}</p>}
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
            <div className='text-sm text-muted-foreground sm:text-right'>
              <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Updated {new Date(user.updatedAt).toLocaleDateString()}</p>
              {user.deletedAt && <p>Deleted {new Date(user.deletedAt).toLocaleDateString()}</p>}
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
            <p className={user.bio ? '' : 'text-muted-foreground'}>{user.bio ?? 'No bio provided.'}</p>
            <dl className='grid gap-3 sm:grid-cols-3'>
              {[
                ['Profession', user.profession],
                ['Company', user.company],
                ['Experience', `${user.experience} ${user.experience === 1 ? 'year' : 'years'}`],
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
