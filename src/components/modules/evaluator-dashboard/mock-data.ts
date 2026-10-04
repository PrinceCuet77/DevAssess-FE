import type { EvaluatorDashboardData } from '@/types/evaluator-dashboard.types';

// Placeholder data for the layout phase. Replace with the dashboard API hook.
export const MOCK_EVALUATOR_DASHBOARD: EvaluatorDashboardData = {
  stats: {
    totalAssessments: 12,
    totalPurchases: 40,
    totalAttempts: 95,
    totalReviews: 18,
    totalRevenue: '1960.00',
    averageRating: 4.3,
    totalEvaluatedAttempts: 80,
    totalPassedAttempts: 52,
    passRate: 65,
    assessmentsByStatus: { DRAFT: 2, PUBLISHED: 9, ARCHIVED: 1 },
    attemptsByStatus: { EVALUATED: 80, IN_PROGRESS: 10, SUBMITTED: 5 },
  },
  recentPurchases: [
    {
      id: '1',
      purchaseId: 'p1',
      price: '49.00',
      createdAt: '2026-10-01T10:00:00.000Z',
      assessment: { id: 'a1', title: 'Node.js Basics' },
      customer: { id: 'c1', name: 'Ayesha Rahman', email: 'ayesha@example.com' },
      payments: [{ status: 'SUCCESS' }],
    },
    {
      id: '2',
      purchaseId: 'p2',
      price: '79.00',
      createdAt: '2026-09-30T08:00:00.000Z',
      assessment: { id: 'a2', title: 'React Advanced Patterns' },
      customer: { id: 'c2', name: null, email: 'dev@example.com' },
      payments: [{ status: 'PENDING' }],
    },
    {
      id: '3',
      purchaseId: 'p3',
      price: '29.00',
      createdAt: '2026-09-28T08:00:00.000Z',
      assessment: { id: 'a3', title: 'TypeScript Fundamentals' },
      customer: { id: 'c3', name: 'Karim Hasan', email: 'karim@example.com' },
      payments: [],
    },
  ],
  recentReviews: [
    {
      id: 'r1',
      rating: 5,
      comment: 'Well structured questions and fair difficulty.',
      createdAt: '2026-10-01T10:00:00.000Z',
      developer: { id: 'c1', name: 'Ayesha Rahman', email: 'ayesha@example.com' },
      assessment: { id: 'a1', title: 'Node.js Basics' },
    },
    {
      id: 'r2',
      rating: 3,
      comment: null,
      createdAt: '2026-09-29T10:00:00.000Z',
      developer: { id: 'c3', name: 'Karim Hasan', email: 'karim@example.com' },
      assessment: { id: 'a3', title: 'TypeScript Fundamentals' },
    },
  ],
  topAssessments: [
    { id: 'a1', title: 'Node.js Basics', price: '49.00', status: 'PUBLISHED', _count: { purchases: 14, reviews: 6, attempts: 30 } },
    { id: 'a2', title: 'React Advanced Patterns', price: '79.00', status: 'PUBLISHED', _count: { purchases: 10, reviews: 4, attempts: 22 } },
    { id: 'a3', title: 'TypeScript Fundamentals', price: '29.00', status: 'DRAFT', _count: { purchases: 4, reviews: 1, attempts: 8 } },
  ],
};
