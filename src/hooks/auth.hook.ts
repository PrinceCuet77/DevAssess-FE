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
import { clearUserStorage } from '@/lib/storage';
import { readRedirectParam, resolveRedirect } from '@/lib/redirect';


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

// Cart, exam drafts and cached results belong to the user who is leaving.
export const useLogout = () => {
  return useMutation({
    mutationFn: userLogout,
    onSuccess: clearUserStorage,
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

// After a successful login the cookies are set; load the profile and go back to where the user was
// sent from (`?redirect=`), or to the role's dashboard.
export const usePostLoginRedirect = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    const response = await getMyProfile();
    queryClient.setQueryData(['my-profile'], response);
    const { role } = response.data;
    router.replace(resolveRedirect(readRedirectParam(), role) ?? ROLE_DASHBOARD_PATH[role]);
  };
};