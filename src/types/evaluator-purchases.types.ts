import type { SortOrder } from '@/types/admin-users.types';
import type { PaymentStatus } from '@/types/developer-dashboard.types';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';

export type EvaluatorPurchasesSortBy = 'createdAt' | 'price';

export type EvaluatorPurchasesQuery = {
  // Matches orders with *any* payment attempt in that status, not just the latest.
  paymentStatus?: PaymentStatus;
  assessmentId?: string;
  customerId?: string;
  // Contains-match on one of my assessment titles, the customer's name or email.
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: EvaluatorPurchasesSortBy;
  sortOrder?: SortOrder;
};

export type EvaluatorPurchasePayment = {
  id: string;
  transactionId: string;
  status: PaymentStatus;
  // Covers the whole order, not just the evaluator's share.
  amount: string;
  currency: string;
  method: string | null;
  paidAt: string | null;
  createdAt: string;
};

export type EvaluatorPurchaseCustomer = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  profession: string | null;
  company: string | null;
};

export type EvaluatorPurchaseAssessment = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  // The assessment's *current* list price, not what was paid for this line.
  price: string;
  status: AssessmentStatus;
};

export type EvaluatorPurchaseRow = {
  id: string;
  // Whole-order total - not the evaluator's share.
  price: string;
  // The evaluator's own earnings on this order.
  subtotal: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  customer: EvaluatorPurchaseCustomer;
  // Only the evaluator's own lines; other evaluators' items in the order are hidden.
  assessments: EvaluatorPurchaseAssessment[];
  // Newest first; empty if the order never reached the gateway.
  payments: EvaluatorPurchasePayment[];
};

export type UpdatePurchasePricePayload = {
  assessmentId: string;
  // JSON number, ≥ 0.
  price: number;
};
