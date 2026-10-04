import { getAdminDashboard } from '@/api/admin.api';
import { useQuery } from '@tanstack/react-query';

export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
    select: (response) => response.data,
    retry: false,
  });
};
