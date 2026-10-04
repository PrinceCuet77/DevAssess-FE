import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  EvaluatorAssessmentRow,
  EvaluatorAssessmentsQuery,
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
