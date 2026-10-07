import apiClient from '@/lib/apiClient';
import { compact } from '@/lib/utils';
import type { ApiResponse } from '@/types/api.types';
import type {
  CatalogAssessment,
  CatalogQuery,
  CatalogReviewRow,
  CatalogReviewsQuery,
} from '@/types/assessment.types';

export const getAssessmentList = ({ tags, ...query }: CatalogQuery) => {
  return apiClient<ApiResponse<CatalogAssessment[]>>('/assessments', {
    query: compact({ ...query, tags: tags?.length ? tags.join(',') : undefined }),
  });
};

export const getAssessment = (assessmentId: string) => {
  return apiClient<ApiResponse<CatalogAssessment>>(`/assessments/${assessmentId}`);
};

export const getAssessmentReviews = (
  assessmentId: string,
  query: CatalogReviewsQuery & { page: number },
) => {
  return apiClient<ApiResponse<CatalogReviewRow[]>>(`/assessments/${assessmentId}/reviews`, {
    query: compact(query),
  });
};
