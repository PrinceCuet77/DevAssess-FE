import apiClient from '@/lib/apiClient';
import type { AdminDashboardData } from '@/types/admin-dashboard.types';
import type { AdminSettableStatus, AdminUserDetail, AdminUserRow, AdminUsersQuery } from '@/types/admin-users.types';
import type { ApiResponse } from '@/types/api.types';

export const getAdminDashboard = () => {
  return apiClient<ApiResponse<AdminDashboardData>>('/admin/dashboard');
};

// The API rejects empty strings (e.g. `search=`), so drop empty params up front.
const compact = (query: AdminUsersQuery) =>
  Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== ''));

export const getAdminUsers = (query: AdminUsersQuery) => {
  return apiClient<ApiResponse<AdminUserRow[]>>('/admin/users', { query: compact(query) });
};

export const getAdminUser = (userId: string) => {
  return apiClient<ApiResponse<AdminUserDetail>>(`/admin/users/${userId}`);
};

export const updateAdminUserStatus = ({ userId, status }: { userId: string; status: AdminSettableStatus }) => {
  return apiClient<ApiResponse<AdminUserDetail>>(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: { status },
  });
};
