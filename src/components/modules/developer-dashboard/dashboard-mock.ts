import type { DeveloperDashboard } from '@/types/developer-dashboard.types';

// Placeholder data for the layout phase — replace with the /developer/dashboard API response.
export const DEVELOPER_DASHBOARD_MOCK: DeveloperDashboard = {
  stats: {
    totalPurchasedAssessments: 6,
    totalAttempts: 9,
    totalEvaluatedAttempts: 7,
    passedAttemptsCount: 5,
    passRate: 71.43,
    averageScorePercentage: 68.5,
    totalReviewsGiven: 3,
    pendingAssessmentsToAttempt: 2,
  },
  recentAttempts: [
    { id: '1', score: 8, isPassed: true, status: 'EVALUATED', evaluatedAt: '2026-10-01T10:00:00.000Z', createdAt: '2026-10-01T09:30:00.000Z', assessment: { id: 'a1', title: 'Node.js Basics', thumbnailUrl: null } },
    { id: '2', score: 4, isPassed: false, status: 'EVALUATED', evaluatedAt: '2026-09-29T10:00:00.000Z', createdAt: '2026-09-29T09:00:00.000Z', assessment: { id: 'a2', title: 'React Fundamentals', thumbnailUrl: null } },
    { id: '3', score: null, isPassed: null, status: 'IN_PROGRESS', evaluatedAt: null, createdAt: '2026-09-28T08:00:00.000Z', assessment: { id: 'a3', title: 'TypeScript Deep Dive', thumbnailUrl: null } },
  ],
  recentPurchases: [
    { id: 'p1', price: '98.00', createdAt: '2026-09-30T12:00:00.000Z', assessments: [{ id: 'a1', title: 'Node.js Basics', thumbnailUrl: null, price: '49.00' }, { id: 'a2', title: 'React Fundamentals', thumbnailUrl: null, price: '49.00' }], payments: [{ status: 'SUCCESS' }] },
    { id: 'p2', price: '49.00', createdAt: '2026-09-27T12:00:00.000Z', assessments: [{ id: 'a3', title: 'TypeScript Deep Dive', thumbnailUrl: null, price: '49.00' }], payments: [{ status: 'PENDING' }] },
  ],
};
