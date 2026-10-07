import apiClient from '@/lib/apiClient';
import { compact } from '@/lib/utils';
import type { ApiResponse } from '@/types/api.types';
import type { DeveloperDashboard } from '@/types/developer-dashboard.types';
import type {
  AssessmentAttempt,
  AssessmentAttempts,
  AssessmentAttemptsQuery,
  AttemptDetail,
  EvaluateAttemptPayload,
  EvaluateAttemptResult,
  StartedAttempt,
  CreatePaymentResult,
  DeveloperPurchasesQuery,
  DeveloperPurchase,
  DeveloperPayment,
  DeveloperPaymentDetail,
  DeveloperPaymentsQuery,
  DeveloperReview,
  DeveloperReviewsQuery,
  CreateReviewPayload,
  UpdateReviewPayload,
  ReviewRow,
} from '@/types/developer-assessments.types';

export const getDeveloperDashboard = () => {
  return apiClient<ApiResponse<DeveloperDashboard>>('/developer/dashboard');
};

const PURCHASES_PAGE_SIZE = 100;

// There is no "owned assessments" endpoint: page through every order and let the caller derive
// what is owned (paid) and what is waiting on payment (unpaid orders, to avoid paying twice).
export const getAllPurchases = async () => {
  const rows: DeveloperPurchase[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await apiClient<ApiResponse<DeveloperPurchase[]>>('/purchases', {
      query: { page, limit: PURCHASES_PAGE_SIZE },
    });
    rows.push(...res.data);
    totalPages = res.meta?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages);
  return rows;
};

export const getAssessmentAttempts = (assessmentId: string, query: AssessmentAttemptsQuery) => {
  return apiClient<ApiResponse<AssessmentAttempts>>(`/developer/assessments/${assessmentId}/attempts`, {
    query: compact(query),
  });
};

// A GET that creates an attempt and starts its timer: only ever call it from a click handler.
export const startAttempt = (assessmentId: string) => {
  return apiClient<ApiResponse<StartedAttempt>>(`/developer/assessments/${assessmentId}/start`);
};

export const getAttempt = ({ assessmentId, attemptId }: { assessmentId: string; attemptId: string }) => {
  return apiClient<ApiResponse<AttemptDetail>>(`/developer/assessments/${assessmentId}/attempts/${attemptId}`);
};

// Only records `submittedAt`; answers go to `evaluateAttempt`.
export const submitAttempt = ({ assessmentId, attemptId }: { assessmentId: string; attemptId: string }) => {
  return apiClient<ApiResponse<AssessmentAttempt>>(`/developer/assessments/${assessmentId}/submit`, {
    method: 'PATCH',
    body: { attemptId },
  });
};

export const evaluateAttempt = ({ assessmentId, ...body }: EvaluateAttemptPayload) => {
  return apiClient<ApiResponse<EvaluateAttemptResult>>(`/developer/assessments/${assessmentId}/evaluate`, {
    method: 'PATCH',
    body,
  });
};

export const getDeveloperPurchaseList = (query: DeveloperPurchasesQuery) => {
  return apiClient<ApiResponse<DeveloperPurchase[]>>('/purchases', { query: compact(query) });
};

// Creates an unpaid order; payment is a separate step (`createPayment`).
export const createPurchase = (assessmentIds: string[]) => {
  return apiClient<ApiResponse<DeveloperPurchase>>('/purchases', {
    method: 'POST',
    body: { assessmentIds },
  });
};

export const createPayment = (purchaseId: string) => {
  return apiClient<ApiResponse<CreatePaymentResult>>('/payments/create', {
    method: 'POST',
    body: { purchaseId },
  });
};

export const getDeveloperPaymentList = (query: DeveloperPaymentsQuery) => {
  return apiClient<ApiResponse<DeveloperPayment[]>>('/payments', { query: compact(query) });
};

export const getDeveloperPayment = (paymentId: string) => {
  return apiClient<ApiResponse<DeveloperPaymentDetail>>(`/payments/${paymentId}`);
};

export const getDeveloperPurchase = (purchaseId: string) => {
  return apiClient<ApiResponse<DeveloperPurchase>>(`/purchases/${purchaseId}`);
};

export const getDeveloperReviewList = (query: DeveloperReviewsQuery) => {
  return apiClient<ApiResponse<DeveloperReview[]>>('/reviews', { query: compact(query) });
};

export const getDeveloperReview = (reviewId: string) => {
  return apiClient<ApiResponse<DeveloperReview>>(`/reviews/${reviewId}`);
};

export const createReview = (payload: CreateReviewPayload) => {
  return apiClient<ApiResponse<ReviewRow>>('/reviews', { method: 'POST', body: payload });
};

export const updateReview = ({ reviewId, payload }: { reviewId: string; payload: UpdateReviewPayload }) => {
  return apiClient<ApiResponse<ReviewRow>>(`/reviews/${reviewId}`, { method: 'PATCH', body: payload });
};

export const deleteReview = (reviewId: string) => {
  return apiClient<ApiResponse<null>>(`/reviews/${reviewId}`, { method: 'DELETE' });
};
