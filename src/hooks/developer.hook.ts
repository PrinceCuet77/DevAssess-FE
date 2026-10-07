import {
  getAssessmentAttempts,
  getAttempt,
  startAttempt,
  submitAttempt,
  evaluateAttempt,
  createPayment,
  createPurchase,
  getDeveloperDashboard,
  getDeveloperPurchaseList,
  getAllPurchases,
  getDeveloperPaymentList,
  getDeveloperPayment,
  getDeveloperPurchase,
  getDeveloperReviewList,
  getDeveloperReview,
  createReview,
  updateReview,
  deleteReview,
} from '@/api/developer.api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import type { ApiResponse } from '@/types/api.types';
import type {
  AssessmentAttemptsQuery,
  AttemptAssessment,
  AttemptDetail,
  DeveloperPaymentsQuery,
  DeveloperPurchase,
  DeveloperPurchasesQuery,
  DeveloperReviewsQuery,
  OwnedAssessment,
  PendingOrder,
} from '@/types/developer-assessments.types';

export const useGetDeveloperDashboard = () => {
  return useQuery({
    queryKey: ['developer-dashboard'],
    queryFn: getDeveloperDashboard,
    select: (response) => response.data,
    retry: false,
  });
};

const isPaid = (purchase: DeveloperPurchase) => purchase.payments.some((p) => p.status === 'SUCCESS');

// Flatten paid orders into unique assessments, keeping the most recent purchase of each.
const toOwnedAssessments = (purchases: DeveloperPurchase[]): OwnedAssessment[] => {
  const owned = new Map<string, OwnedAssessment>();
  for (const purchase of purchases) {
    if (!isPaid(purchase)) continue;
    const paidAt =
      purchase.payments.find((p) => p.status === 'SUCCESS')?.paidAt ?? purchase.createdAt;
    for (const assessment of purchase.assessments) {
      const existing = owned.get(assessment.id);
      if (!existing || paidAt > existing.purchasedAt) {
        owned.set(assessment.id, { ...assessment, purchaseId: purchase.id, purchasedAt: paidAt });
      }
    }
  }
  return [...owned.values()];
};

// assessmentId -> newest unpaid order holding it. The API lets the same assessment sit in several
// unpaid orders, so the UI points the developer back at the existing order instead of a new one.
const toPendingOrders = (purchases: DeveloperPurchase[]): Record<string, PendingOrder> => {
  const pending: Record<string, PendingOrder> = {};
  for (const purchase of purchases) {
    if (isPaid(purchase)) continue;
    for (const assessment of purchase.assessments) {
      const existing = pending[assessment.id];
      if (existing && existing.createdAt > purchase.createdAt) continue;
      pending[assessment.id] = {
        purchaseId: purchase.id,
        price: purchase.price,
        createdAt: purchase.createdAt,
        status: purchase.payments[0]?.status ?? 'UNPAID',
      };
    }
  }
  return pending;
};

// One cached fetch of every order backs the owned set, the pending set and the double-payment guard.
const PURCHASE_INDEX_KEY = ['developer-owned-assessments'];

const purchaseIndexQuery = (enabled: boolean) => ({
  queryKey: PURCHASE_INDEX_KEY,
  queryFn: getAllPurchases,
  staleTime: 60_000,
  enabled,
  retry: false,
});

// `enabled` lets public pages skip this until they know the viewer is a developer.
export const useGetOwnedAssessments = (enabled = true) => {
  return useQuery({ ...purchaseIndexQuery(enabled), select: toOwnedAssessments });
};

export const useGetPendingOrders = (enabled = true) => {
  return useQuery({ ...purchaseIndexQuery(enabled), select: toPendingOrders });
};

export const useGetAllPurchases = (enabled = true) => {
  return useQuery(purchaseIndexQuery(enabled));
};

export const useGetAssessmentAttempts = (assessmentId: string, query: AssessmentAttemptsQuery = {}) => {
  return useQuery({
    queryKey: ['developer-assessment-attempts', assessmentId, query],
    queryFn: () => getAssessmentAttempts(assessmentId, query),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

// Questions never change mid-attempt, so don't spend the rate limit refetching them on focus.
export const useGetAttempt = (assessmentId: string, attemptId: string) => {
  return useQuery({
    queryKey: ['developer-attempt', attemptId],
    queryFn: () => getAttempt({ assessmentId, attemptId }),
    select: (response) => response.data,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

// Anything that changes an attempt also changes the history, the dashboard and review eligibility.
const useInvalidateAttempts = () => {
  const queryClient = useQueryClient();
  return (assessmentId: string) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['developer-assessment-attempts', assessmentId] }),
      queryClient.invalidateQueries({ queryKey: ['developer-dashboard'] }),
    ]);
};

export const useStartAttempt = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAttempts();
  return useMutation({
    mutationFn: ({ assessmentId }: { assessmentId: string; assessment?: AttemptAssessment }) =>
      startAttempt(assessmentId),
    onSuccess: ({ data }, { assessmentId, assessment }) => {
      // Seed the exam screen so opening it doesn't cost another request. A backend without the
      // questions-on-start change sends none; let the exam screen fetch and report that instead.
      if (assessment && Array.isArray(data.questions)) {
        const { questions, ...attempt } = data;
        queryClient.setQueryData<ApiResponse<AttemptDetail>>(['developer-attempt', attempt.id], {
          success: true,
          statusCode: 200,
          message: '',
          data: { assessment, attempt, questions },
        });
      }
      return invalidate(assessmentId);
    },
  });
};

export const useSubmitAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAttempt,
    onSuccess: ({ data }) =>
      queryClient.setQueryData<ApiResponse<AttemptDetail>>(['developer-attempt', data.id], (old) =>
        old ? { ...old, data: { ...old.data, attempt: data } } : old,
      ),
  });
};

export const useEvaluateAttempt = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAttempts();
  return useMutation({
    mutationFn: evaluateAttempt,
    onSuccess: (_, { assessmentId, attemptId }) =>
      Promise.all([
        invalidate(assessmentId),
        queryClient.invalidateQueries({ queryKey: ['developer-attempt', attemptId] }),
      ]),
  });
};

export const useGetDeveloperPurchaseList = (query: DeveloperPurchasesQuery) => {
  return useQuery({
    queryKey: ['developer-purchase-list', query],
    queryFn: () => getDeveloperPurchaseList(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

const PURCHASE_QUERY_KEYS = ['developer-purchase-list', 'developer-purchase', 'developer-dashboard', ...PURCHASE_INDEX_KEY];

const useInvalidatePurchases = () => {
  const queryClient = useQueryClient();
  return () => Promise.all(PURCHASE_QUERY_KEYS.map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
};

// A 409 here means the cart was stale (already owned), so refresh the owned set either way.
export const useCreatePurchase = () => {
  const invalidate = useInvalidatePurchases();
  return useMutation({
    mutationFn: createPurchase,
    onSuccess: invalidate,
    onError: (error) => {
      if (error instanceof FetchError && error.status === 409) invalidate();
    },
  });
};

// 409 = the order was paid in the meantime (another tab); refresh so it shows as owned.
export const useCreatePayment = () => {
  const invalidate = useInvalidatePurchases();
  return useMutation({
    mutationFn: createPayment,
    onError: (error) => {
      if (error instanceof FetchError && error.status === 409) invalidate();
    },
  });
};

export const useGetDeveloperPaymentList = (query: DeveloperPaymentsQuery) => {
  return useQuery({
    queryKey: ['developer-payment-list', query],
    queryFn: () => getDeveloperPaymentList(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetDeveloperPayment = (paymentId: string) => {
  return useQuery({
    queryKey: ['developer-payment', paymentId],
    queryFn: () => getDeveloperPayment(paymentId),
    select: (response) => response.data,
    retry: false,
  });
};

// Used by the gateway return screen: the query string is never proof of payment, so re-read the order.
export const useGetDeveloperPurchase = (purchaseId: string) => {
  return useQuery({
    queryKey: ['developer-purchase', purchaseId],
    queryFn: () => getDeveloperPurchase(purchaseId),
    select: (response) => response.data,
    retry: false,
  });
};

export const useGetDeveloperReviewList = (query: DeveloperReviewsQuery) => {
  return useQuery({
    queryKey: ['developer-review-list', query],
    queryFn: () => getDeveloperReviewList(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

// Only fetched while the review modal is open (`enabled`), so closed cards cost nothing.
export const useGetDeveloperReview = (reviewId: string, enabled = true) => {
  return useQuery({
    queryKey: ['developer-review', reviewId],
    queryFn: () => getDeveloperReview(reviewId),
    select: (response) => response.data,
    enabled,
    retry: false,
  });
};

// There is no per-assessment "my review" endpoint, and the catalog's embedded `reviews` still lists
// deleted ones, so look the review up in the developer's own (non-deleted) reviews by title.
export const useGetMyAssessmentReview = (assessment: { id: string; title: string } | undefined) => {
  const search = assessment?.title.trim() ?? '';
  return useQuery({
    queryKey: ['developer-review-list', { search, limit: 100, assessmentId: assessment?.id }],
    queryFn: () => getDeveloperReviewList({ search, limit: 100 }),
    select: (response) => response.data.find((r) => r.assessment.id === assessment?.id) ?? null,
    enabled: Boolean(search),
    retry: false,
  });
};

// Reviews show up in the "my reviews" list, the single-review modal, the embedded
// `reviews` array of every assessment and the public catalog, so refresh all of them after a write.
const REVIEW_QUERY_KEYS = [
  'developer-review-list',
  'developer-review',
  'developer-assessment',
  'developer-dashboard',
  'assessment-list',
  'assessment',
  'assessment-reviews',
];

const useInvalidateReviews = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      REVIEW_QUERY_KEYS.map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    );
};

// 409 = a review already exists (e.g. written in another tab); refresh so the UI offers "Edit" instead.
export const useCreateReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: createReview,
    onSuccess: invalidate,
    onError: (error) => {
      if (error instanceof FetchError && error.status === 409) invalidate();
    },
  });
};

export const useUpdateReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: updateReview, onSuccess: invalidate });
};

export const useDeleteReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: deleteReview, onSuccess: invalidate });
};
