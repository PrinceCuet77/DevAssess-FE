'use client';

import RecentReviews from '@/components/modules/evaluator-dashboard/recent-reviews';
import RecentSales from '@/components/modules/evaluator-dashboard/recent-sales';
import StatsGrid from '@/components/modules/evaluator-dashboard/stats-grid';
import EvaluatorCharts from '@/components/modules/evaluator-dashboard/evaluator-charts';
import TopAssessments from '@/components/modules/evaluator-dashboard/top-assessments';
import DashboardSkeleton from '@/components/modules/evaluator-dashboard/dashboard-skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useGetEvaluatorDashboard } from '@/hooks';

const EvaluatorDashboardView = () => {
  const { data, isPending, isError } = useGetEvaluatorDashboard();

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

  const { stats, recentPurchases, recentReviews, topAssessments } = data;

  return (
    <div className='flex flex-col gap-6'>
      <StatsGrid stats={stats} />
      <EvaluatorCharts stats={stats} topAssessments={topAssessments} />
      <div className='grid gap-6 lg:grid-cols-2'>
        <RecentSales purchases={recentPurchases} />
        <TopAssessments assessments={topAssessments} />
      </div>
      <RecentReviews reviews={recentReviews} />
    </div>
  );
};

export default EvaluatorDashboardView;
