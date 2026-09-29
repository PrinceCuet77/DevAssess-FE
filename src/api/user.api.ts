import apiClient from '@/lib/apiClient';
import { ApiResponse } from '@/types/api.types';
import { User } from '@/types/user.types';

export const getMyProfile = () => {
  return apiClient<ApiResponse<User>>('/users/me');
};
