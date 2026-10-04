import apiClient from '@/lib/apiClient';
import type { changePasswordPayload } from '@/types/user.types';
// import { ApiResponse } from '@/types/api.types';
// import { User } from '@/types/user.types';

export const getMyProfile = () => {
  return apiClient('/users/me');
};

export const changePassword = (payload: changePasswordPayload) => {
  return apiClient('/users/me/change-password', { method: 'PATCH', body: payload });
};
