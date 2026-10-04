import apiClient from '@/lib/apiClient';
import { loginPayload, registerPayload, resendOtpPayload, forgotPasswordPayload, resetPasswordPayload, verifyEmailPayload } from '@/types/auth.types';

export const userLogin = (payload: loginPayload) => {
  return apiClient('/auth/login', { method: 'POST', body: payload });
};

export const userRegister = (payload: registerPayload) => {
  return apiClient('/auth/register', { method: 'POST', body: payload });
};

export const userEmailAccount = (payload: verifyEmailPayload) => {
  return apiClient('/auth/verify-email', { method: 'POST', body: payload });
};

export const userResendVerificationOtp = (payload: resendOtpPayload) => {
  return apiClient('/auth/resend-otp', { method: 'POST', body: payload });
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

export const userResetPassword = (payload: resetPasswordPayload) => {
  return apiClient('/auth/reset-password', { method: 'POST', body: payload });
};

export const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
