import {
  userLogin,
  userLogout,
  userForgotPassword,
  userResetPassword,
  userRegister,
  userEmailAccount,
  userResendVerificationOtp,
} from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestCredentials } from '@/constants/test-credentials';
import { type Role } from '@/types/user.types';
import { useRouter } from 'next/navigation';
import { getMyProfile } from '@/api/user.api';
import { ROLE_DASHBOARD_PATH } from '@/constants/routes';


export const useLogin = () => {
  return useMutation({
    mutationFn: userLogin,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: userRegister,
  });
};

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: userEmailAccount,
  });
};

export const useResendVerificationOtp = () => {
  return useMutation({
    mutationFn: userResendVerificationOtp,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: userForgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: userResetPassword,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: userLogout,
  });
};

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

// After a successful login the cookies are set; load the profile and land on the role's dashboard.
export const usePostLoginRedirect = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    const response = await getMyProfile();
    queryClient.setQueryData(['my-profile'], response);
    router.replace(ROLE_DASHBOARD_PATH[response.data.role]);
  };
};