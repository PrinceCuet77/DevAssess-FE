'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, LogIn, Settings2, ShoppingCart, Trash2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { creatorName } from '@/components/modules/public-assessments/catalog-utils';
import PayOrderButton from '@/components/modules/developer-purchases/pay-order-button';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart, useGetMyProfile, useGetOwnedAssessments, useGetPendingOrders } from '@/hooks';
import { loginHref } from '@/lib/redirect';
import type { CatalogAssessment } from '@/types/assessment.types';

type IProps = {
  assessment: CatalogAssessment;
  // Compact = the mobile sticky bar: primary button only, no helper text.
  compact?: boolean;
};

const Hint = ({ children }: { children: React.ReactNode }) => (
  <p className='text-center text-xs text-muted-foreground'>{children}</p>
);

// The right call to action depends on who is looking: guests sign in, developers buy, pay an
// order they already started, or continue; the owning evaluator manages it; other roles can't buy.
const PurchaseAction = ({ assessment, compact }: IProps) => {
  const router = useRouter();
  const profile = useGetMyProfile();
  const user = profile.data;
  const isDeveloper = user?.role === 'DEVELOPER';
  const owned = useGetOwnedAssessments(isDeveloper);
  const pending = useGetPendingOrders(isDeveloper);
  const cart = useCart();

  if (profile.isPending || (isDeveloper && owned.isPending)) {
    return <Skeleton className='h-10 w-full rounded-lg' />;
  }

  const buttonClass = 'h-10 w-full text-sm';

  if (!user) {
    return (
      <div className='flex flex-col gap-2'>
        <Button
          size='lg'
          className={buttonClass}
          nativeButton={false}
          render={<Link href={loginHref(`/assessments/detail?id=${assessment.id}`)} />}
        >
          <LogIn />
          Sign in to purchase
        </Button>
        {!compact && (
          <Hint>
            New to DevAssess?{' '}
            <Link href='/register' className='font-medium text-primary hover:underline'>
              Create a free account
            </Link>
          </Hint>
        )}
      </div>
    );
  }

  if (isDeveloper) {
    if (owned.data?.some((a) => a.id === assessment.id)) {
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
          {!compact && <Hint>You already own this assessment.</Hint>}
        </div>
      );
    }

    const pendingOrder = pending.data?.[assessment.id];
    if (pendingOrder) {
      return (
        <div className='flex flex-col gap-2'>
          <PayOrderButton purchaseId={pendingOrder.purchaseId} label='Complete payment' size='lg' className={buttonClass} />
          {!compact && (
            <Hint>
              It&apos;s in an{' '}
              <Link href={`/developer/purchases/detail?id=${pendingOrder.purchaseId}`} className='font-medium text-primary hover:underline'>
                unpaid order
              </Link>{' '}
              already. Pay that order to unlock it.
            </Hint>
          )}
        </div>
      );
    }

    if (cart.has(assessment.id)) {
      return (
        <div className='flex flex-col gap-2'>
          <Button size='lg' className={buttonClass} nativeButton={false} render={<Link href='/developer/cart' />}>
            <Check />
            In cart · Checkout
          </Button>
          {!compact && (
            <Button
              variant='ghost'
              className={buttonClass}
              onClick={() => {
                cart.remove(assessment.id);
                toast.success('Removed from your cart.');
              }}
            >
              <Trash2 />
              Remove from cart
            </Button>
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
          <Zap />
          Buy now
        </Button>
        {!compact && (
          <>
            <Button
              variant='outline'
              className={buttonClass}
              onClick={() => {
                cart.add({
                  id: assessment.id,
                  title: assessment.title,
                  price: assessment.price,
                  thumbnailUrl: assessment.thumbnailUrl,
                  tags: assessment.tags,
                  duration: assessment.duration,
                  passingPercentage: assessment.passingPercentage,
                  creatorName: creatorName(assessment.creator),
                });
                toast.success('Added to your cart.', {
                  action: { label: 'View cart', onClick: () => router.push('/developer/cart') },
                });
              }}
            >
              <ShoppingCart />
              Add to cart
            </Button>
            <Hint>Secure checkout via SSLCommerz.</Hint>
          </>
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
