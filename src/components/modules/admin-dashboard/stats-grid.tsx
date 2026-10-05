import {
  BookOpenCheck,
  ClipboardList,
  Coins,
  ShoppingBag,
  Star,
  Target,
  UserCheck,
  Users,
} from "lucide-react";
import StatCard from "@/components/shared/stat-card";
import type { AdminDashboardStats } from "@/types/admin-dashboard.types";

const StatsGrid = ({ stats }: { stats: AdminDashboardStats }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard
      label="Total revenue"
      value={`BDT ${Number(stats.totalRevenue).toFixed(2)}`}
      hint="From successful payments"
      icon={Coins}
    />
    <StatCard
      label="Users"
      value={stats.totalUsers}
      hint={`${stats.usersByRole.EVALUATOR ?? 0} evaluators · ${stats.usersByRole.DEVELOPER ?? 0} developers`}
      icon={Users}
    />
    <StatCard
      label="Assessments"
      value={stats.totalAssessments}
      hint={`${stats.assessmentsByStatus.PUBLISHED ?? 0} published`}
      icon={BookOpenCheck}
    />
    <StatCard
      label="Orders"
      value={stats.totalPurchases}
      hint="Including unpaid"
      icon={ShoppingBag}
    />
    <StatCard
      label="Total attempts"
      value={stats.totalAttempts}
      hint={`${stats.totalEvaluatedAttempts} evaluated`}
      icon={ClipboardList}
    />
    <StatCard
      label="Pass rate"
      value={`${stats.passRate.toFixed(1)}%`}
      hint={`${stats.totalPassedAttempts} passed`}
      icon={Target}
    />
    <StatCard label="Reviews" value={stats.totalReviews} icon={Star} />
    <StatCard
      label="Verified users"
      value={stats.usersByStatus.VERIFIED ?? 0}
      hint={`${stats.usersByStatus.NOT_VERIFIED ?? 0} not verified · ${stats.usersByStatus.SUSPENDED ?? 0} suspended`}
      icon={UserCheck}
    />
  </div>
);

export default StatsGrid;
