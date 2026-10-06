import type { AttemptStatus, PaymentStatus } from '@/types/developer-dashboard.types';

export type DeveloperPurchaseAssessment = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  price: string;
  duration: number;
  passingPercentage: number;
  creator: { id: string; name: string | null; email: string };
};

export type DeveloperPurchasePayment = {
  id: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
};

export type DeveloperPurchase = {
  id: string;
  price: string;
  createdAt: string;
  assessments: DeveloperPurchaseAssessment[];
  payments: DeveloperPurchasePayment[];
};

// An assessment the developer owns, flattened out of a paid order.
export type OwnedAssessment = DeveloperPurchaseAssessment & {
  purchaseId: string;
  purchasedAt: string;
};

export type OwnedSortKey = 'purchased:desc' | 'purchased:asc' | 'title:asc' | 'duration:asc' | 'duration:desc';

export type OwnedAssessmentsQuery = {
  search?: string;
  sort?: OwnedSortKey;
  page?: number;
  limit?: number;
};

export type AssessmentReview = {
  id: string;
  rating: number;
  comment: string | null;
  developer: { id: string; name: string | null; email: string };
};

// `GET /assessments/:id` — questions and the answer key are never included.
export type DeveloperAssessmentDetail = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  tags: string[];
  duration: number;
  price: string;
  passingPercentage: number;
  publishedAt: string | null;
  createdAt: string;
  creator: { id: string; name: string | null; email: string };
  reviews: AssessmentReview[];
};

export type AssessmentAttempt = {
  id: string;
  score: number | null;
  isPassed: boolean | null;
  status: AttemptStatus;
  startedAt: string;
  endedAt: string;
  submittedAt: string | null;
  evaluatedAt: string | null;
  createdAt: string;
};

export type AssessmentAttempts = {
  assessment: { id: string; title: string };
  attempts: AssessmentAttempt[];
};
