import type { SortOrder } from '@/types/admin-users.types';
import type { AssessmentStatus } from '@/types/evaluator-dashboard.types';

export type EvaluatorAssessmentsSortBy = 'createdAt' | 'title' | 'price' | 'duration';

export type EvaluatorAssessmentsQuery = {
  status?: AssessmentStatus;
  search?: string;
  // Exact minutes, not a range.
  duration?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: EvaluatorAssessmentsSortBy;
  sortOrder?: SortOrder;
};

// Rows also carry the full `questions` / `answers`; the list only needs the summary fields.
export type EvaluatorAssessmentRow = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  // Minutes.
  duration: number;
  price: string;
  passingPercentage: number;
  status: AssessmentStatus;
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Statuses that PATCH accepts — `DELETED` is only reachable through DELETE.
export type EvaluatorSettableStatus = Exclude<AssessmentStatus, 'DELETED'>;
