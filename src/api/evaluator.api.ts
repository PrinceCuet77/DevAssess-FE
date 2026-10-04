import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api.types';
import type { EvaluatorDashboardData } from '@/types/evaluator-dashboard.types';

export const getEvaluatorDashboard = () => {
  return apiClient<ApiResponse<EvaluatorDashboardData>>('/evaluator/dashboard');
};
