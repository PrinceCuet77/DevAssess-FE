import type { UserStatus } from '@/types/admin-dashboard.types';
import type { SortOrder } from '@/types/admin-users.types';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';

export type AdminAssessmentsSortBy = 'createdAt' | 'title' | 'price';

export type AdminAssessmentsQuery = {
  status?: AssessmentStatus;
  creatorId?: string;
  // Comma-separated, e.g. `react,node`. The API matches assessments having any of them.
  tags?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminAssessmentsSortBy;
  sortOrder?: SortOrder;
};

export type AdminAssessmentRow = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  // Minutes.
  duration: number;
  price: string;
  // 0–100.
  passingPercentage: number;
  status: AssessmentStatus;
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  creator: { id: string; name: string | null; email: string; status: UserStatus };
  _count: { purchases: number; reviews: number; attempts: number };
};

// `GET /assessments/:id` - the public detail payload. The backend has no `GET /admin/assessments/:id`
// yet, so this is the only single-assessment endpoint an admin can call. PUBLISHED assessments only.
export type AdminAssessmentReview = {
  id: string;
  rating: number;
  comment: string | null;
  developer: { id: string; name: string | null; email: string };
};

export type AdminAssessmentDetail = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  duration: number;
  price: string;
  passingPercentage: number;
  publishedAt: string | null;
  createdAt: string;
  creator: { id: string; name: string | null; email: string };
  reviews: AdminAssessmentReview[];
};
