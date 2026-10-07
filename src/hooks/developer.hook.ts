import {
  getAssessmentAttempts,
  getDeveloperAssessment,
  createPayment,
  createPurchase,
  getDeveloperDashboard,
  getDeveloperPurchaseList,
  getPaidPurchases,
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
import type {
  DeveloperPaymentsQuery,
  DeveloperPurchase,
  DeveloperPurchasesQuery,
  DeveloperReviewsQuery,
  OwnedAssessment,
} from '@/types/developer-assessments.types';

export const useGetDeveloperDashboard = () => {
  return useQuery({
    queryKey: ['developer-dashboard'],
    queryFn: getDeveloperDashboard,
    select: (response) => response.data,
    retry: false,
  });
};

// Flatten paid orders into unique assessments, keeping the most recent purchase of each.
const toOwnedAssessments = (purchases: DeveloperPurchase[]): OwnedAssessment[] => {
  const owned = new Map<string, OwnedAssessment>();
  for (const purchase of purchases) {
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

// `enabled` lets public pages skip this until they know the viewer is a developer.
export const useGetOwnedAssessments = (enabled = true) => {
  return useQuery({
    queryKey: ['developer-owned-assessments'],
    queryFn: getPaidPurchases,
    select: toOwnedAssessments,
    staleTime: 60_000,
    enabled,
    retry: false,
  });
};

export const useGetDeveloperAssessment = (assessmentId: string) => {
  return useQuery({
    queryKey: ['developer-assessment', assessmentId],
    queryFn: () => getDeveloperAssessment(assessmentId),
    select: (response) => response.data,
    retry: false,
  });
};

export const useGetAssessmentAttempts = (assessmentId: string) => {
  return useQuery({
    queryKey: ['developer-assessment-attempts', assessmentId],
    queryFn: () => getAssessmentAttempts(assessmentId),
    select: (response) => response.data.attempts,
    retry: false,
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

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-purchase-list'] });
      queryClient.invalidateQueries({ queryKey: ['developer-dashboard'] });
    },
  });
};

export const useCreatePayment = () => {
  return useMutation({ mutationFn: createPayment });
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

export const useCreateReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: createReview, onSuccess: invalidate });
};

export const useUpdateReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: updateReview, onSuccess: invalidate });
};

export const useDeleteReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: deleteReview, onSuccess: invalidate });
};
