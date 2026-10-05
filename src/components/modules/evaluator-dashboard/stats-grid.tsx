import { BookOpenCheck, ClipboardList, Coins, ShoppingBag, Star, Target } from 'lucide-react';
import StatCard from '@/components/shared/stat-card';
import type { EvaluatorDashboardStats } from '@/types/evaluator-dashboard.types';

const StatsGrid = ({ stats }: { stats: EvaluatorDashboardStats }) => (
  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6'>
    <StatCard
      label='Total revenue'
      value={`BDT ${Number(stats.totalRevenue).toFixed(2)}`}
      hint='From paid orders'
      icon={Coins}
    />
    <StatCard
      label='Assessments'
      value={stats.totalAssessments}
      hint={`${stats.assessmentsByStatus.PUBLISHED ?? 0} published`}
      icon={BookOpenCheck}
    />
    <StatCard label='Assessments sold' value={stats.totalPurchases} icon={ShoppingBag} />
    <StatCard
      label='Total attempts'
      value={stats.totalAttempts}
      hint={`${stats.totalEvaluatedAttempts} evaluated`}
      icon={ClipboardList}
    />
    <StatCard
      label='Pass rate'
      value={`${stats.passRate.toFixed(1)}%`}
      hint={`${stats.totalPassedAttempts} passed`}
      icon={Target}
    />
    <StatCard
      label='Average rating'
      value={stats.averageRating.toFixed(1)}
      hint={`${stats.totalReviews} reviews`}
      icon={Star}
    />
  </div>
);

export default StatsGrid;
