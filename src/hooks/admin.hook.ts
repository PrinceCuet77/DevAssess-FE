import { getAdminDashboard, getAdminUser, getAdminUsers } from '@/api/admin.api';
import type { AdminUsersQuery } from '@/types/admin-users.types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

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
