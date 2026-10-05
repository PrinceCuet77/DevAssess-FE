'use client';

import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteAccountDialog from '@/components/modules/profile/delete-account-dialog';
import ProfileForm from '@/components/modules/profile/profile-form';
import ProfileSkeleton from '@/components/modules/profile/profile-skeleton';
import { useGetMyProfile } from '@/hooks';

const ProfileView = () => {
  const { data: user, isPending, isError } = useGetMyProfile();

  if (isPending) return <ProfileSkeleton />;

  if (isError || !user) {
    return (
      <Card>
        <CardContent className='py-6 text-center text-sm text-muted-foreground'>
          We couldn&apos;t load your profile. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]'>
      <ProfileForm key={user.id} user={user} />

      <aside className='flex flex-col gap-6 xl:sticky xl:top-24'>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Keep your account safe with a strong password.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href='/change-password' className={buttonVariants({ variant: 'outline' })}>
              <KeyRound />
              Change password
            </Link>
          </CardContent>
        </Card>

        <Card className='ring-destructive/40'>
          <CardHeader>
            <CardTitle className='text-destructive'>Danger zone</CardTitle>
            <CardDescription>
              Deleting your account is permanent and can only be reversed by an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteAccountDialog />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default ProfileView;
