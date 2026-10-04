import { changePassword, getMyProfile } from '@/api/user.api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
    select: (response) => response.data,
    retry: false,
  });
};

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}