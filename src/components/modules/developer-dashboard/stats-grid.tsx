import { BookOpenCheck, ClipboardList, Percent, Star, Target, Trophy } from 'lucide-react';
import StatCard from '@/components/modules/developer-dashboard/stat-card';
import type { DeveloperDashboardStats } from '@/types/developer-dashboard.types';

const StatsGrid = ({ stats }: { stats: DeveloperDashboardStats }) => (
  <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
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
    <StatCard label='Pass rate' value={`${stats.passRate.toFixed(1)}%`} icon={Target} />
    <StatCard
      label='Average score'
      value={`${stats.averageScorePercentage.toFixed(1)}%`}
      icon={Percent}
    />
    <StatCard label='Reviews given' value={stats.totalReviewsGiven} icon={Star} />
  </div>
);

export default StatsGrid;
