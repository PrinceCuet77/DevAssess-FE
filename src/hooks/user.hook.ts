import {
  changePassword,
  confirmAvatar,
  deleteMyAccount,
  getAvatarPresign,
  getMyProfile,
  removeAvatar,
  updateMyProfile,
  uploadAvatarToS3,
} from '@/api/user.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const PROFILE_KEY = ['my-profile'];

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: PROFILE_KEY,
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

// Each endpoint returns the fresh User envelope; drop it straight into the cache.
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (response) => queryClient.setQueryData(PROFILE_KEY, response),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const { data } = await getAvatarPresign({ contentType: file.type, fileSize: file.size });
      await uploadAvatarToS3(data.uploadUrl, file);
      return confirmAvatar(data.key);
    },
    onSuccess: (response) => queryClient.setQueryData(PROFILE_KEY, response),
  });
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAvatar,
    onSuccess: (response) => queryClient.setQueryData(PROFILE_KEY, response),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => queryClient.clear(),
  });
}
