import type { SortOrder } from '@/types/admin-users.types';
import type { PaymentStatus } from '@/types/developer-dashboard.types';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';

export type AdminPurchasesSortBy = 'createdAt' | 'price';

export type AdminPurchasesQuery = {
  // Matches orders with *any* payment attempt in that status, not just the latest.
  paymentStatus?: PaymentStatus;
  assessmentId?: string;
  customerId?: string;
  // Contains-match on an assessment title in the order (not the customer).
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminPurchasesSortBy;
  sortOrder?: SortOrder;
};

type Person = { id: string; name: string | null; email: string };

export type AdminPurchaseAssessment = {
  id: string;
  title: string;
  // The assessment's *current* price, not what was paid for this line.
  price: string;
  status: AssessmentStatus;
  creator: Person;
};

export type AdminPurchasePayment = {
  id: string;
  transactionId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  paidAt: string | null;
  createdAt: string;
};

export type AdminPurchaseRow = {
  id: string;
  // Order total at purchase time; the authoritative amount.
  price: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  customer: Person;
  assessments: AdminPurchaseAssessment[];
  // Newest first; empty if the order never reached the gateway.
  payments: AdminPurchasePayment[];
};
