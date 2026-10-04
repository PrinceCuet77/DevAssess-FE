import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  AvatarPresign,
  changePasswordPayload,
  UpdateProfilePayload,
  User,
} from '@/types/user.types';

export const getMyProfile = () => {
  return apiClient<ApiResponse<User>>('/users/me');
};

export const updateMyProfile = (payload: UpdateProfilePayload) => {
  return apiClient<ApiResponse<User>>('/users/me', {
    method: 'PATCH',
    body: payload,
  });
};

export const changePassword = (payload: changePasswordPayload) => {
  return apiClient('/users/me/change-password', {
    method: 'PATCH',
    body: payload,
  });
};

export const getAvatarPresign = (payload: {
  contentType: string;
  fileSize: number;
}) => {
  return apiClient<ApiResponse<AvatarPresign>>('/users/me/avatar/presign', {
    method: 'POST',
    body: payload,
  });
};

// Goes straight to S3: no cookies, no auth header, so a plain fetch rather than apiClient.
export const uploadAvatarToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!response.ok) throw new Error('Avatar upload failed');
};

export const confirmAvatar = (key: string) => {
  return apiClient<ApiResponse<User>>('/users/me/avatar', {
    method: 'PATCH',
    body: { key },
  });
};

export const removeAvatar = () => {
  return apiClient<ApiResponse<User>>('/users/me/avatar', { method: 'DELETE' });
};

export const deleteMyAccount = () => {
  return apiClient('/users/me', { method: 'DELETE' });
};
