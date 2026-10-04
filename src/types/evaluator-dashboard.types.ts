import type { AttemptStatus, PaymentStatus } from '@/types/developer-dashboard.types';

export type AssessmentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';

export type EvaluatorDashboardStats = {
  totalAssessments: number;
  totalPurchases: number;
  totalAttempts: number;
  totalReviews: number;
  totalRevenue: string | number;
  averageRating: number;
  totalEvaluatedAttempts: number;
  totalPassedAttempts: number;
  passRate: number;
  assessmentsByStatus: Partial<Record<AssessmentStatus, number>>;
  attemptsByStatus: Partial<Record<AttemptStatus, number>>;
};

type Person = { id: string; name: string | null; email: string };

export type EvaluatorRecentPurchase = {
  id: string;
  purchaseId: string;
  price: string;
  createdAt: string;
  assessment: { id: string; title: string };
  customer: Person;
  payments: { status: PaymentStatus }[];
};

export type EvaluatorRecentReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  developer: Person;
  assessment: { id: string; title: string };
};

export type EvaluatorTopAssessment = {
  id: string;
  title: string;
  price: string;
  status: AssessmentStatus;
  _count: { purchases: number; reviews: number; attempts: number };
};

export type EvaluatorDashboardData = {
  stats: EvaluatorDashboardStats;
  recentPurchases: EvaluatorRecentPurchase[];
  recentReviews: EvaluatorRecentReview[];
  topAssessments: EvaluatorTopAssessment[];
};
