'use client';

import Link from 'next/link';
import { ArrowRight, LogIn, Settings2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMyProfile, useGetOwnedAssessments } from '@/hooks';
import type { CatalogAssessment } from '@/types/assessment.types';

type IProps = {
  assessment: CatalogAssessment;
  // Compact = the mobile sticky bar: primary button only, no helper text.
  compact?: boolean;
};

// The right call to action depends on who is looking: guests sign in, developers buy or
// continue, the owning evaluator manages it, and other roles can't purchase at all.
const PurchaseAction = ({ assessment, compact }: IProps) => {
  const profile = useGetMyProfile();
  const user = profile.data;
  const isDeveloper = user?.role === 'DEVELOPER';
  const owned = useGetOwnedAssessments(isDeveloper);

  if (profile.isPending || (isDeveloper && owned.isPending)) {
    return <Skeleton className='h-10 w-full rounded-lg' />;
  }

  const buttonClass = 'h-10 w-full text-sm';

  if (!user) {
    return (
      <div className='flex flex-col gap-2'>
        <Button size='lg' className={buttonClass} nativeButton={false} render={<Link href='/login' />}>
          <LogIn />
          Sign in to purchase
        </Button>
        {!compact && (
          <p className='text-center text-xs text-muted-foreground'>
            New to DevAssess?{' '}
            <Link href='/register' className='font-medium text-primary hover:underline'>
              Create a free account
            </Link>
          </p>
        )}
      </div>
    );
  }

  if (isDeveloper) {
    const isOwned = owned.data?.some((a) => a.id === assessment.id);
    if (isOwned) {
      return (
        <div className='flex flex-col gap-2'>
          <Button
            size='lg'
            className={buttonClass}
            nativeButton={false}
            render={<Link href={`/developer/assessments/detail?id=${assessment.id}`} />}
          >
            Go to assessment
            <ArrowRight />
          </Button>
          {!compact && (
            <p className='text-center text-xs text-muted-foreground'>You already own this assessment.</p>
          )}
        </div>
      );
    }
    return (
      <div className='flex flex-col gap-2'>
        <Button
          size='lg'
          className={buttonClass}
          nativeButton={false}
          render={<Link href={`/developer/checkout?assessmentId=${assessment.id}`} />}
        >
          <ShoppingCart />
          Buy now
        </Button>
        {!compact && (
          <p className='text-center text-xs text-muted-foreground'>Secure checkout via SSLCommerz.</p>
        )}
      </div>
    );
  }

  if (user.role === 'EVALUATOR' && user.id === assessment.creator.id) {
    return (
      <Button
        size='lg'
        variant='outline'
        className={buttonClass}
        nativeButton={false}
        render={<Link href={`/evaluator/assessments/detail?id=${assessment.id}`} />}
      >
        <Settings2 />
        Manage your assessment
      </Button>
    );
  }

  return (
    <p role='status' className='rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground'>
      Purchasing is available to developer accounts only.
    </p>
  );
};

export default PurchaseAction;
