import { useMutation } from '@tanstack/react-query';
import { userLogin } from '@/api';
import { getTestCredentials } from '@/constants/test-credentials';
import { usePostLoginRedirect } from '@/hooks/post-login.hook';
import type { Role } from '@/types/user.types';

export const useTestLogin = () => {
  const redirectToDashboard = usePostLoginRedirect();

  return useMutation({
    mutationFn: async (role: Role) => {
      const credentials = getTestCredentials(role);
      await userLogin(credentials);
      await redirectToDashboard();
    },
  });
};
