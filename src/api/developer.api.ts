import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api.types';
import type { DeveloperDashboard } from '@/types/developer-dashboard.types';
import type {
  AssessmentAttempts,
  CreatePaymentResult,
  DeveloperPurchasesQuery,
  DeveloperAssessmentDetail,
  DeveloperPurchase,
  DeveloperPayment,
  DeveloperPaymentDetail,
  DeveloperPaymentsQuery,
  DeveloperReview,
  DeveloperReviewsQuery,
} from '@/types/developer-assessments.types';

export const getDeveloperDashboard = () => {
  return apiClient<ApiResponse<DeveloperDashboard>>('/developer/dashboard');
};

const PURCHASES_PAGE_SIZE = 100;

// There is no "owned assessments" endpoint: page through every paid order and let the caller flatten it.
export const getPaidPurchases = async () => {
  const rows: DeveloperPurchase[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await apiClient<ApiResponse<DeveloperPurchase[]>>('/purchases', {
      query: { paymentStatus: 'SUCCESS', page, limit: PURCHASES_PAGE_SIZE },
    });
    rows.push(...res.data);
    totalPages = res.meta?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages);
  return rows;
};

export const getDeveloperAssessment = (assessmentId: string) => {
  return apiClient<ApiResponse<DeveloperAssessmentDetail>>(`/assessments/${assessmentId}`);
};

export const getAssessmentAttempts = (assessmentId: string) => {
  return apiClient<ApiResponse<AssessmentAttempts>>(`/developer/assessments/${assessmentId}/attempts`, {
    query: { sortBy: 'createdAt', sortOrder: 'desc', limit: 100 },
  });
};

// The API rejects empty strings (e.g. `search=`), so drop empty params up front.
const compact = (query: object) =>
  Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== ''));

export const getDeveloperPurchaseList = (query: DeveloperPurchasesQuery) => {
  return apiClient<ApiResponse<DeveloperPurchase[]>>('/purchases', { query: compact(query) });
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
