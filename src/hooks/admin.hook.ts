import {
  getAdminDashboard,
  getAdminUser,
  getAdminUsers,
  updateAdminUserStatus,
} from '@/api/admin.api';
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
