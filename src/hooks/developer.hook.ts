import {
  getAssessmentAttempts,
  getDeveloperAssessment,
  createPayment,
  getDeveloperDashboard,
  getDeveloperPurchaseList,
  getPaidPurchases,
  getDeveloperPaymentList,
  getDeveloperPayment,
  getDeveloperPurchase,
} from '@/api/developer.api';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type {
  DeveloperPaymentsQuery,
  DeveloperPurchase,
  DeveloperPurchasesQuery,
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

export const useGetOwnedAssessments = () => {
  return useQuery({
    queryKey: ['developer-owned-assessments'],
    queryFn: getPaidPurchases,
    select: toOwnedAssessments,
    staleTime: 60_000,
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
