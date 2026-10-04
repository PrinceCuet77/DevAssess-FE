import { KeyRound, UserRound } from 'lucide-react';
import type { Role } from '@/types/user.types';

export const LOGIN_PATH = '/login';

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  DEVELOPER: '/developer',
  EVALUATOR: '/evaluator',
  ADMIN: '/admin',
};

export const USER_NAV_ITEMS = [
  { title: 'Update profile', href: '/profile', icon: UserRound },
  { title: 'Change password', href: '/change-password', icon: KeyRound },
];
