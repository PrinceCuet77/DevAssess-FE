import { userLogin, userLogout, userForgotPassword, userResetPassword } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation({
    mutationFn: userLogin,
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
