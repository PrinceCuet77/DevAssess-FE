'use client';

import { Coins, ReceiptText, ShoppingBag } from 'lucide-react';
import { formatMoney } from '@/components/modules/admin-purchases/purchase-utils';
import StatCard from '@/components/shared/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEvaluatorDashboard } from '@/hooks';

// Lifetime totals come from the dashboard stats: the purchases list is paginated and
// includes unpaid orders, so it can't be summed client-side.
const SalesSummary = () => {
  const { data, isPending, isError } = useGetEvaluatorDashboard();

  if (isError) return null;
  if (isPending) {
    return (
      <div className='grid gap-4 sm:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-[106px] rounded-xl' />
        ))}
      </div>
    );
  }

  const revenue = Number(data.stats.totalRevenue);
  const sold = data.stats.totalPurchases;

  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      <StatCard label='Total revenue' value={formatMoney(revenue)} hint='Paid orders only' icon={Coins} />
      <StatCard
        label='Assessments sold'
        value={sold}
        hint='Line items across all orders'
        icon={ShoppingBag}
      />
      <StatCard
        label='Average sale'
        value={sold ? formatMoney(revenue / sold) : 'N/A'}
        hint='Revenue per assessment sold'
        icon={ReceiptText}
      />
    </div>
  );
};

export default SalesSummary;
