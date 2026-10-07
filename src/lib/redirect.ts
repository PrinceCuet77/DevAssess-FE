import type { Role } from '@/types/user.types';

const REDIRECT_PARAM = 'redirect';
const OAUTH_REDIRECT_KEY = 'devassess-oauth-redirect';

const ROLE_AREAS: Record<string, Role> = {
  '/developer': 'DEVELOPER',
  '/evaluator': 'EVALUATOR',
  '/admin': 'ADMIN',
};

// Only same-origin paths, never back to an auth page, and never into another role's area
// (that would just land on "Access denied").
export const resolveRedirect = (target: string | null | undefined, role: Role): string | null => {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) return null;
  const path = target.split(/[?#]/)[0];
  if (['/login', '/register', '/verify-account', '/forgot-password', '/auth/success'].includes(path)) return null;
  const area = Object.keys(ROLE_AREAS).find((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (area && ROLE_AREAS[area] !== role) return null;
  return target;
};

export const loginHref = (returnTo: string) => `/login?${REDIRECT_PARAM}=${encodeURIComponent(returnTo)}`;

export const currentPath = () => `${window.location.pathname}${window.location.search}`;

export const readRedirectParam = () => new URLSearchParams(window.location.search).get(REDIRECT_PARAM);

// Google sign-in leaves the site entirely, so park the target until /auth/success.
export const stashOAuthRedirect = () => {
  const target = readRedirectParam();
  try {
    if (target) sessionStorage.setItem(OAUTH_REDIRECT_KEY, target);
    else sessionStorage.removeItem(OAUTH_REDIRECT_KEY);
  } catch {
    // ignore: we'll just land on the dashboard
  }
};

export const takeOAuthRedirect = () => {
  try {
    const target = sessionStorage.getItem(OAUTH_REDIRECT_KEY);
    sessionStorage.removeItem(OAUTH_REDIRECT_KEY);
    return target;
  } catch {
    return null;
  }
};
