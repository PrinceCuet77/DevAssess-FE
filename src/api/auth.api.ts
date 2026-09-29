import apiClient from '@/lib/apiClient';
import { loginPayload, registerPayload, forgotPasswordPayload, googleOAuthPayload } from '@/types/auth.types';

export const userLogin = (payload: loginPayload) => {
  return apiClient('/auth/login', { method: 'POST', body: payload });
};

export const userRegisterUsingCredential = (payload: registerPayload) => {
  return apiClient('/auth/register', { method: 'POST', body: payload });
};

export const userLogout = () => {
  return apiClient('/auth/logout', { method: 'POST' });
};

export const userForgotPassword = (payload: forgotPasswordPayload) => {
  return apiClient('/auth/forgot-password', { method: 'POST', body: payload });
};

export const googleOAuth = (payload: googleOAuthPayload) => {
  return apiClient('/auth/google', { method: 'POST', body: payload})
}