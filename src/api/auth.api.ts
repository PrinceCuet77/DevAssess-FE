import apiClient from '@/lib/apiClient';
import { loginPayload, registerPayload, forgotPasswordPayload } from '@/types/auth.types';

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

// The Google flow is a full-page browser navigation handled by the API, not an XHR.
export const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
