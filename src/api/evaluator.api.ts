import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  EvaluatorAssessmentDetail,
  EvaluatorAssessmentRow,
  EvaluatorAssessmentsQuery,
  EvaluatorPurchaseRow,
  EvaluatorSettableStatus,
} from '@/types/evaluator-assessments.types';
import type { EvaluatorDashboardData } from '@/types/evaluator-dashboard.types';

export const getEvaluatorDashboard = () => {
  return apiClient<ApiResponse<EvaluatorDashboardData>>('/evaluator/dashboard');
};

// The API rejects empty strings (e.g. `search=`), so drop empty params up front.
const compact = (query: EvaluatorAssessmentsQuery) =>
  Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== ''));

export const getEvaluatorAssessments = (query: EvaluatorAssessmentsQuery) => {
  return apiClient<ApiResponse<EvaluatorAssessmentRow[]>>('/evaluator/assessments', {
    query: compact(query),
  });
};

export const getEvaluatorAssessment = (assessmentId: string) => {
  return apiClient<ApiResponse<EvaluatorAssessmentDetail>>(`/evaluator/assessments/${assessmentId}`);
};

export const updateEvaluatorAssessmentStatus = ({
  assessmentId,
  status,
}: {
  assessmentId: string;
  status: EvaluatorSettableStatus;
}) => {
  return apiClient<ApiResponse<EvaluatorAssessmentRow>>(`/evaluator/assessments/${assessmentId}`, {
    method: 'PATCH',
    body: { status },
  });
};

export const deleteEvaluatorAssessment = (assessmentId: string) => {
  return apiClient<ApiResponse<null>>(`/evaluator/assessments/${assessmentId}`, {
    method: 'DELETE',
  });
};

const PURCHASES_PAGE_SIZE = 100;

// Assessment endpoints carry no sales data, so pull the evaluator's orders (optionally for one assessment), all pages.
export const getEvaluatorPurchases = async (assessmentId?: string) => {
  const rows: EvaluatorPurchaseRow[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await apiClient<ApiResponse<EvaluatorPurchaseRow[]>>('/evaluator/purchases', {
      query: { page, limit: PURCHASES_PAGE_SIZE, ...(assessmentId && { assessmentId }) },
    });
    rows.push(...res.data);
    totalPages = res.meta?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages);
  return rows;
};
