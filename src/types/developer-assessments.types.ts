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
  transactionId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  method: string | null;
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

export type DeveloperPurchasesQuery = {
  paymentStatus?: PaymentStatus;
  search?: string;
  sortBy?: 'createdAt' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export type CreatePaymentResult = {
  gatewayPageURL: string;
  transactionId: string;
};

export type DeveloperPaymentAssessment = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  price: string;
};

export type DeveloperPayment = {
  id: string;
  transactionId: string;
  valId: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  purchase: {
    id: string;
    price: string;
    assessments: DeveloperPaymentAssessment[];
  };
};

export type DeveloperPaymentDetail = DeveloperPayment & {
  purchase: DeveloperPayment['purchase'] & {
    customerId: string;
    createdAt: string;
    updatedAt: string;
    customer: { id: string; name: string | null; email: string };
  };
};

export type DeveloperPaymentsQuery = {
  status?: PaymentStatus;
  sortBy?: 'createdAt' | 'amount' | 'paidAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export type DeveloperReviewsQuery = {
  search?: string;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

// `GET /reviews` — the developer's own reviews, each with the assessment it belongs to.
export type DeveloperReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  assessment: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
    price: string;
    duration: number;
  };
  developer: { id: string; name: string | null; email: string };
};

export type CreateReviewPayload = {
  assessmentId: string;
  rating: number;
  comment: string;
};

// Both optional on edit.
export type UpdateReviewPayload = {
  rating?: number;
  comment?: string;
};

// `POST /reviews` and `PATCH /reviews/:id` return the raw review row, without the joined assessment.
export type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  developerId: string;
  assessmentId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
