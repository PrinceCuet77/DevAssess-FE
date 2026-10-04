import apiClient from '@/lib/apiClient';
import type { AdminDashboardData } from '@/types/admin-dashboard.types';
import type { ApiResponse } from '@/types/api.types';

export const getAdminDashboard = () => {
  return apiClient<ApiResponse<AdminDashboardData>>('/admin/dashboard');
};
