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
