export type AttemptStatus = 'IDLE' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'EXPIRED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type DeveloperDashboardStats = {
  totalPurchasedAssessments: number;
  totalAttempts: number;
  totalEvaluatedAttempts: number;
  passedAttemptsCount: number;
  passRate: number;
  averageScorePercentage: number;
  totalReviewsGiven: number;
  pendingAssessmentsToAttempt: number;
};

export type DeveloperRecentAttempt = {
  id: string;
  score: number | null;
  isPassed: boolean | null;
  status: AttemptStatus;
  evaluatedAt: string | null;
  createdAt: string;
  assessment: { id: string; title: string; thumbnailUrl: string | null };
};

export type DeveloperRecentPurchase = {
  id: string;
  price: string;
  createdAt: string;
  assessments: { id: string; title: string; thumbnailUrl: string | null; price: string }[];
  payments: { status: PaymentStatus }[];
};

export type DeveloperDashboard = {
  stats: DeveloperDashboardStats;
  recentAttempts: DeveloperRecentAttempt[];
  recentPurchases: DeveloperRecentPurchase[];
};
