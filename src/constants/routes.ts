import type { Role } from '@/types/user.types';

export const LOGIN_PATH = '/login';

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  DEVELOPER: '/developer',
  EVALUATOR: '/evaluator',
  ADMIN: '/admin',
};
