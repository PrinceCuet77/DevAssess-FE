import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api.types';
import type { DeveloperDashboard } from '@/types/developer-dashboard.types';

export const getDeveloperDashboard = () => {
  return apiClient<ApiResponse<DeveloperDashboard>>('/developer/dashboard');
};
