import { FetchError } from 'ofetch';

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof FetchError) {
    const data = error.data as { message?: string } | undefined;
    return data?.message ?? error.statusMessage ?? fallback;
  }

  return fallback;
};

// Validation errors arrive as "<field>: <reason>, <field>: <reason>"; split them per field.
export const parseFieldErrors = (error: unknown): Record<string, string> => {
  if (!(error instanceof FetchError) || error.status !== 400) return {};
  const message = (error.data as { message?: string } | undefined)?.message;
  if (!message) return {};

  const result: Record<string, string> = {};
  for (const part of message.split(', ')) {
    const index = part.indexOf(': ');
    if (index > 0) result[part.slice(0, index)] = part.slice(index + 2);
  }
  return result;
};
