import { FetchError } from 'ofetch';

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof FetchError) {
    const data = error.data as { message?: string } | undefined;
    return data?.message ?? error.statusMessage ?? fallback;
  }

  return fallback;
};
