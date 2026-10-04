import {
  getAdminAssessment,
  getAdminAssessments,
  getAdminDashboard,
  getAdminUser,
  getAdminUsers,
  updateAdminUserStatus,
} from '@/api/admin.api';
import type { AdminAssessmentsQuery } from '@/types/admin-assessments.types';
import type { AdminUsersQuery } from '@/types/admin-users.types';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
    select: (response) => response.data,
    retry: false,
  });
};

export const useGetAdminUsers = (query: AdminUsersQuery) => {
  return useQuery({
    queryKey: ['admin-users', query],
    queryFn: () => getAdminUsers(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetAdminAssessments = (query: AdminAssessmentsQuery) => {
  return useQuery({
    queryKey: ['admin-assessments', query],
    queryFn: () => getAdminAssessments(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetAdminUser = (userId: string) => {
  return useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => getAdminUser(userId),
    select: (response) => response.data,
    retry: false,
  });
};

// Status changes ripple into the list, the detail page and the dashboard's status breakdown.
export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });
};

export const useGetAdminAssessment = (assessmentId: string) => {
  return useQuery({
    queryKey: ['admin-assessment', assessmentId],
    queryFn: () => getAdminAssessment(assessmentId),
    select: (response) => response.data,
    retry: false,
  });
};

// There's no `GET /admin/assessments/:id`, and the public detail 404s for non-published assessments,
// so find the row by scanning the admin list (which includes every status).
export const useGetAdminAssessmentRow = (assessmentId: string) => {
  return useQuery({
    queryKey: ['admin-assessments', 'row', assessmentId],
    queryFn: async () => {
      for (let page = 1; ; page++) {
        const { data, meta } = await getAdminAssessments({ page, limit: 100 });
        const row = data.find((r) => r.id === assessmentId);
        if (row) return row;
        if (!meta || page >= meta.totalPages) return null;
      }
    },
    retry: false,
  });
};
