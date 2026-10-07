'use client';

import { Coins, Percent, ShoppingBag, Star } from 'lucide-react';
import AdminCharts from '@/components/modules/admin-dashboard/admin-charts';
import StatCard from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAdminDashboard } from '@/hooks';

const AnalyticsSkeleton = () => (
  <div className='flex flex-col gap-6' aria-busy='true' aria-label='Loading analytics'>
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className='h-24 rounded-xl' />
      ))}
    </div>
    <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className='h-80 rounded-xl' />
      ))}
    </div>
    <div className='grid gap-6 lg:grid-cols-2'>
      <Skeleton className='h-80 rounded-xl' />
      <Skeleton className='h-80 rounded-xl' />
    </div>
  </div>
);

// Built on the dashboard endpoint: it is the only aggregate the API exposes (no time series yet).
const AdminAnalyticsView = () => {
  const { data, isPending, isError, refetch } = useGetAdminDashboard();

  if (isPending) return <AnalyticsSkeleton />;

  if (isError || !data) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center gap-3 py-6 text-center text-sm text-muted-foreground'>
          We couldn&apos;t load analytics.
          <Button variant='outline' onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { stats } = data;
  const revenue = Number(stats.totalRevenue);

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard label='Total revenue' value={`BDT ${revenue.toFixed(2)}`} hint='From successful payments' icon={Coins} />
        <StatCard
          label='Average order value'
          value={`BDT ${(stats.totalPurchases ? revenue / stats.totalPurchases : 0).toFixed(2)}`}
          hint={`Across ${stats.totalPurchases} orders`}
          icon={ShoppingBag}
        />
        <StatCard
          label='Pass rate'
          value={`${stats.passRate.toFixed(1)}%`}
          hint={`${stats.totalPassedAttempts} of ${stats.totalEvaluatedAttempts} evaluated`}
          icon={Percent}
        />
        <StatCard
          label='Reviews per assessment'
          value={(stats.totalAssessments ? stats.totalReviews / stats.totalAssessments : 0).toFixed(1)}
          hint={`${stats.totalReviews} reviews in total`}
          icon={Star}
        />
      </div>
      <AdminCharts stats={stats} detailed />
    </div>
  );
};

export default AdminAnalyticsView;
