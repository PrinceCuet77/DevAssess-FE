'use client';

import { Check, Clock3, ShoppingCart } from 'lucide-react';
import { useCart, useGetMyProfile, useGetOwnedAssessments, useGetPendingOrders } from '@/hooks';
import { cn } from '@/lib/utils';

// There's no `isOwned` flag in the catalog, so cards look it up in the developer's cached
// purchases (one shared query) and local cart. Renders nothing for guests and other roles.
const OwnershipBadge = ({ assessmentId, className }: { assessmentId: string; className?: string }) => {
  const { data: user } = useGetMyProfile();
  const isDeveloper = user?.role === 'DEVELOPER';
  const owned = useGetOwnedAssessments(isDeveloper);
  const pending = useGetPendingOrders(isDeveloper);
  const cart = useCart();

  if (!isDeveloper) return null;

  let badge: { icon: typeof Check; label: string; tone: string } | null = null;
  if (owned.data?.some((a) => a.id === assessmentId)) {
    badge = { icon: Check, label: 'Owned', tone: 'bg-emerald-600 text-white' };
  } else if (pending.data?.[assessmentId]) {
    badge = { icon: Clock3, label: 'Awaiting payment', tone: 'bg-amber-500 text-white' };
  } else if (cart.has(assessmentId)) {
    badge = { icon: ShoppingCart, label: 'In cart', tone: 'bg-primary text-primary-foreground' };
  }
  if (!badge) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm',
        badge.tone,
        className,
      )}
    >
      <badge.icon className='size-3.5' aria-hidden />
      {badge.label}
    </span>
  );
};

export default OwnershipBadge;
