import type { PaymentStatus } from '@/types/developer-dashboard.types';
import type { SortOrder } from '@/types/admin-users.types';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';

export type EvaluatorAssessmentsSortBy = 'createdAt' | 'title' | 'price' | 'duration';

export type EvaluatorAssessmentsQuery = {
  status?: AssessmentStatus;
  search?: string;
  // Exact minutes, not a range.
  duration?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: EvaluatorAssessmentsSortBy;
  sortOrder?: SortOrder;
};

// Rows also carry the full `questions` / `answers`; the list only needs the summary fields.
export type EvaluatorAssessmentRow = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  // Minutes.
  duration: number;
  price: string;
  passingPercentage: number;
  status: AssessmentStatus;
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Statuses that PATCH accepts — `DELETED` is only reachable through DELETE.
export type EvaluatorSettableStatus = Exclude<AssessmentStatus, 'DELETED'>;

export type EvaluatorQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  marks: number;
};

export type EvaluatorAnswerKey = { questionId: string; answer: string };

export type EvaluatorAssessmentReview = {
  id: string;
  rating: number;
  comment: string | null;
  developerId: string;
  assessmentId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EvaluatorAssessmentDetail = EvaluatorAssessmentRow & {
  questions: EvaluatorQuestion[];
  answers: EvaluatorAnswerKey[];
  creator: { id: string; name: string | null; email: string };
  reviews: EvaluatorAssessmentReview[];
};

export type EvaluatorPurchasePayment = {
  id: string;
  transactionId: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  method: string | null;
  paidAt: string | null;
  createdAt: string;
};

export type EvaluatorPurchaseRow = {
  id: string;
  // Whole-order total — not the evaluator's share.
  price: string;
  // The evaluator's own earnings on this order.
  subtotal: string;
  createdAt: string;
  customer: { id: string; name: string | null; email: string };
  // Only the evaluator's own lines; `price` is the current list price, not the paid price.
  assessments: { id: string; title: string; price: string }[];
  // Newest first.
  payments: EvaluatorPurchasePayment[];
};
