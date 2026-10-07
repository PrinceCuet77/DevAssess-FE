import { BookOpenCheck, ClipboardList, Percent, Star, Target, Trophy } from 'lucide-react';
import StatCard from '@/components/shared/stat-card';
import type { DeveloperDashboardStats } from '@/types/developer-dashboard.types';

// With nothing evaluated yet, 0% would read as "failed everything".
const rate = (value: number, stats: DeveloperDashboardStats) =>
  stats.totalEvaluatedAttempts === 0 ? '-' : `${value.toFixed(1)}%`;

const StatsGrid = ({ stats }: { stats: DeveloperDashboardStats }) => (
  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6'>
    <StatCard
      label='Purchased assessments'
      value={stats.totalPurchasedAssessments}
      hint={`${stats.pendingAssessmentsToAttempt} not attempted yet`}
      icon={BookOpenCheck}
    />
    <StatCard
      label='Total attempts'
      value={stats.totalAttempts}
      hint={`${stats.totalEvaluatedAttempts} evaluated`}
      icon={ClipboardList}
    />
    <StatCard
      label='Passed attempts'
      value={stats.passedAttemptsCount}
      hint={`of ${stats.totalEvaluatedAttempts} evaluated`}
      icon={Trophy}
    />
    <StatCard label='Pass rate' value={rate(stats.passRate, stats)} icon={Target} />
    <StatCard
      label='Average score'
      value={rate(stats.averageScorePercentage, stats)}
      icon={Percent}
    />
    <StatCard label='Reviews given' value={stats.totalReviewsGiven} icon={Star} />
  </div>
);

export default StatsGrid;
