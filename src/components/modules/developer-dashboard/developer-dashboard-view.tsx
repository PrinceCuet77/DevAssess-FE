'use client';

import DeveloperCharts from '@/components/modules/developer-dashboard/developer-charts';
import DashboardSkeleton from '@/components/modules/developer-dashboard/dashboard-skeleton';
import PendingBanner from '@/components/modules/developer-dashboard/pending-banner';
import RecentAttempts from '@/components/modules/developer-dashboard/recent-attempts';
import RecentPurchases from '@/components/modules/developer-dashboard/recent-purchases';
import StatsGrid from '@/components/modules/developer-dashboard/stats-grid';
import Link from 'next/link';
import { Compass, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetDeveloperDashboard, useGetMyProfile } from '@/hooks';

const DeveloperDashboardView = () => {
  const { data, isPending, isError } = useGetDeveloperDashboard();
  const { data: user } = useGetMyProfile();

  if (isPending) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <Card>
        <CardContent className='py-6 text-center text-sm text-muted-foreground'>
          We couldn&apos;t load your dashboard. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  const { stats, recentAttempts, recentPurchases } = data;
  const isNew = stats.totalPurchasedAssessments === 0 && stats.totalAttempts === 0 && recentPurchases.length === 0;

  return (
    <div className='flex flex-col gap-6'>
      {user && !user.name && (
        <Card className='bg-muted/40'>
          <CardContent className='flex flex-wrap items-center gap-3'>
            <UserRound className='size-5 shrink-0 text-muted-foreground' />
            <p className='flex-1 text-sm'>Add your name and skills so evaluators know who&apos;s behind your results.</p>
            <Button size='sm' variant='outline' nativeButton={false} render={<Link href='/profile' />}>
              Complete your profile
            </Button>
          </CardContent>
        </Card>
      )}
      {isNew && (
        <Card className='bg-gradient-to-br from-primary/10 via-background to-background ring-primary/20'>
          <CardContent className='flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center'>
            <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary'>
              <Compass className='size-5' />
            </span>
            <div className='flex-1'>
              <p className='font-heading text-base font-semibold'>Find your first assessment</p>
              <p className='text-sm text-muted-foreground'>
                Browse the catalog, buy an assessment and your stats will start showing up here.
              </p>
            </div>
            <Button nativeButton={false} render={<Link href='/assessments' />}>
              Browse assessments
            </Button>
          </CardContent>
        </Card>
      )}
      <PendingBanner count={stats.pendingAssessmentsToAttempt} />
      <StatsGrid stats={stats} />
      <DeveloperCharts stats={stats} attempts={recentAttempts} />
      <div className='grid gap-6 lg:grid-cols-2'>
        <RecentAttempts attempts={recentAttempts} />
        <RecentPurchases purchases={recentPurchases} />
      </div>
    </div>
  );
};

export default DeveloperDashboardView;
