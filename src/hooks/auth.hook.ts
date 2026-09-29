import { userLogin, userLogout, userForgotPassword, googleOAuth } from '@/api';
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

export const useLogout = () => {
  return useMutation({
    mutationFn: userLogout,
  });
};

export const useGoogleOAuth = () => {
  return useMutation({
    mutationFn: googleOAuth,
  })
}