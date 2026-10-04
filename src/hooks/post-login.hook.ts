import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { getMyProfile } from '@/api/user.api';
import { ROLE_DASHBOARD_PATH } from '@/constants/routes';

// After a successful login the cookies are set; load the profile and land on the role's dashboard.
export const usePostLoginRedirect = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    const response = await getMyProfile();
    queryClient.setQueryData(['user'], response);
    router.replace(ROLE_DASHBOARD_PATH[response.data.role]);
  };
};
