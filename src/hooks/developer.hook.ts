import { getDeveloperDashboard } from '@/api/developer.api';
import { useQuery } from '@tanstack/react-query';

export const useGetDeveloperDashboard = () => {
  return useQuery({
    queryKey: ['developer-dashboard'],
    queryFn: getDeveloperDashboard,
    select: (response) => response.data,
    retry: false,
  });
};
