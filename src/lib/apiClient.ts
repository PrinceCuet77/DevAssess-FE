import { FetchError, ofetch, type FetchOptions } from 'ofetch';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const baseClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: 'include',
});

// Concurrent 401s share one refresh call; the backend rotates the refresh token, so a second
// parallel refresh would use an already-spent token and log the user out.
let refreshing: Promise<unknown> | null = null;

const refreshSession = () => {
  refreshing ??= baseClient('/auth/refresh-token', { method: 'POST' }).finally(() => {
    refreshing = null;
  });
  return refreshing;
};

// The access token is short-lived: on a 401, refresh the cookies once and replay the request.
// Auth endpoints are excluded (a 401 there is a real answer, e.g. wrong password).
const apiClient = async <T = unknown>(request: string, options?: FetchOptions<'json'>): Promise<T> => {
  try {
    return await baseClient<T>(request, options);
  } catch (error) {
    if (!(error instanceof FetchError) || error.status !== 401 || request.startsWith('/auth/')) throw error;
    try {
      await refreshSession();
    } catch {
      throw error;
    }
    return baseClient<T>(request, options);
  }
};

export default apiClient;
