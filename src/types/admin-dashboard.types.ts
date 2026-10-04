import type { AttemptStatus, PaymentStatus } from '@/types/developer-dashboard.types';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';

export type UserRole = 'DEVELOPER' | 'EVALUATOR' | 'ADMIN';
export type UserStatus = 'NOT_VERIFIED' | 'VERIFIED' | 'SUSPENDED' | 'DELETED';

export type AdminDashboardStats = {
  totalUsers: number;
  totalAssessments: number;
  totalPurchases: number;
  totalAttempts: number;
  totalReviews: number;
  totalRevenue: string | number;
  totalEvaluatedAttempts: number;
  totalPassedAttempts: number;
  passRate: number;
  usersByRole: Partial<Record<UserRole, number>>;
  usersByStatus: Partial<Record<UserStatus, number>>;
  assessmentsByStatus: Partial<Record<AssessmentStatus, number>>;
  attemptsByStatus: Partial<Record<AttemptStatus, number>>;
};

type Person = { id: string; name: string | null; email: string };

export type AdminRecentUser = Person & {
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type AdminRecentAssessment = {
  id: string;
  title: string;
  status: AssessmentStatus;
  price: string;
  createdAt: string;
  creator: Person;
};

export type AdminRecentPurchase = {
  id: string;
  price: string;
  createdAt: string;
  customer: Person;
  assessments: { id: string; title: string }[];
  payments: { status: PaymentStatus }[];
};

export type AdminDashboardData = {
  stats: AdminDashboardStats;
  recentUsers: AdminRecentUser[];
  recentAssessments: AdminRecentAssessment[];
  recentPurchases: AdminRecentPurchase[];
};
