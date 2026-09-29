import { getMyProfile } from '@/api/user.api';
import { useQuery } from '@tanstack/react-query';

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getMyProfile,
    select: (response) => response.data,
    retry: false,
  });
};
