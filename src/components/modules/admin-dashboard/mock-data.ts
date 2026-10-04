import type { AdminDashboardData } from '@/types/admin-dashboard.types';

// Placeholder data for the layout phase. Replace with the dashboard API hook.
export const MOCK_ADMIN_DASHBOARD: AdminDashboardData = {
  stats: {
    totalUsers: 120,
    totalAssessments: 40,
    totalPurchases: 75,
    totalAttempts: 300,
    totalReviews: 55,
    totalRevenue: '5400.00',
    totalEvaluatedAttempts: 250,
    totalPassedAttempts: 160,
    passRate: 64,
    usersByRole: { DEVELOPER: 100, EVALUATOR: 18, ADMIN: 2 },
    usersByStatus: { VERIFIED: 110, NOT_VERIFIED: 6, SUSPENDED: 2, DELETED: 2 },
    assessmentsByStatus: { PUBLISHED: 30, DRAFT: 8, ARCHIVED: 1, DELETED: 1 },
    attemptsByStatus: { EVALUATED: 250, SUBMITTED: 20, IN_PROGRESS: 30 },
  },
  recentUsers: [
    { id: 'u1', name: 'Ayesha Rahman', email: 'ayesha@example.com', role: 'DEVELOPER', status: 'VERIFIED', createdAt: '2026-10-03T10:00:00.000Z' },
    { id: 'u2', name: 'Tanvir Hossain', email: 'tanvir@example.com', role: 'EVALUATOR', status: 'VERIFIED', createdAt: '2026-10-02T08:30:00.000Z' },
    { id: 'u3', name: null, email: 'new.user@example.com', role: 'DEVELOPER', status: 'NOT_VERIFIED', createdAt: '2026-10-02T06:15:00.000Z' },
    { id: 'u4', name: 'Nusrat Jahan', email: 'nusrat@example.com', role: 'DEVELOPER', status: 'SUSPENDED', createdAt: '2026-10-01T14:45:00.000Z' },
    { id: 'u5', name: 'Imran Khan', email: 'imran@example.com', role: 'EVALUATOR', status: 'VERIFIED', createdAt: '2026-09-30T09:00:00.000Z' },
  ],
  recentAssessments: [
    { id: 'a1', title: 'Node.js Basics', status: 'PUBLISHED', price: '49.00', createdAt: '2026-10-03T09:00:00.000Z', creator: { id: 'u2', name: 'Tanvir Hossain', email: 'tanvir@example.com' } },
    { id: 'a2', title: 'React Fundamentals', status: 'DRAFT', price: '39.00', createdAt: '2026-10-02T11:00:00.000Z', creator: { id: 'u5', name: 'Imran Khan', email: 'imran@example.com' } },
    { id: 'a3', title: 'SQL Essentials', status: 'PUBLISHED', price: '29.00', createdAt: '2026-10-01T16:20:00.000Z', creator: { id: 'u2', name: 'Tanvir Hossain', email: 'tanvir@example.com' } },
    { id: 'a4', title: 'TypeScript Deep Dive', status: 'ARCHIVED', price: '59.00', createdAt: '2026-09-29T12:00:00.000Z', creator: { id: 'u5', name: 'Imran Khan', email: 'imran@example.com' } },
    { id: 'a5', title: 'Docker for Developers', status: 'PUBLISHED', price: '45.00', createdAt: '2026-09-28T10:10:00.000Z', creator: { id: 'u2', name: null, email: 'tanvir@example.com' } },
  ],
  recentPurchases: [
    { id: 'p1', price: '98.00', createdAt: '2026-10-03T12:00:00.000Z', customer: { id: 'u1', name: 'Ayesha Rahman', email: 'ayesha@example.com' }, assessments: [{ id: 'a1', title: 'Node.js Basics' }, { id: 'a3', title: 'SQL Essentials' }], payments: [{ status: 'SUCCESS' }] },
    { id: 'p2', price: '39.00', createdAt: '2026-10-02T15:30:00.000Z', customer: { id: 'u4', name: 'Nusrat Jahan', email: 'nusrat@example.com' }, assessments: [{ id: 'a2', title: 'React Fundamentals' }], payments: [{ status: 'PENDING' }] },
    { id: 'p3', price: '45.00', createdAt: '2026-10-01T09:45:00.000Z', customer: { id: 'u3', name: null, email: 'new.user@example.com' }, assessments: [{ id: 'a5', title: 'Docker for Developers' }], payments: [{ status: 'FAILED' }] },
    { id: 'p4', price: '29.00', createdAt: '2026-09-30T18:00:00.000Z', customer: { id: 'u1', name: 'Ayesha Rahman', email: 'ayesha@example.com' }, assessments: [{ id: 'a3', title: 'SQL Essentials' }], payments: [] },
    { id: 'p5', price: '49.00', createdAt: '2026-09-29T08:20:00.000Z', customer: { id: 'u4', name: 'Nusrat Jahan', email: 'nusrat@example.com' }, assessments: [{ id: 'a1', title: 'Node.js Basics' }], payments: [{ status: 'SUCCESS' }] },
  ],
};
