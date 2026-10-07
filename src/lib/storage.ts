import { useCallback, useSyncExternalStore } from 'react';

// Everything user-specific we keep in the browser (cart, exam drafts, cached results) shares this
// prefix so logout can wipe it in one go. The theme key deliberately lives outside it.
const PREFIX = 'devassess:';
const CHANGE_EVENT = 'devassess-storage';

export const storageKey = (...parts: string[]) => `${PREFIX}${parts.join(':')}`;

// localStorage can throw (private mode, quota, disabled storage); treat that as "nothing stored".
const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const notify = (key: string) => window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));

export const readJson = <T>(key: string): T | null => {
  const raw = read(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: the in-memory state still works for this tab.
  }
  notify(key);
};

export const removeKey = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
  notify(key);
};

// Called on logout and account deletion so the next person on this browser starts clean.
export const clearUserStorage = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
  notify('*');
};

const subscribe = (onChange: () => void) => {
  // `storage` covers other tabs; the custom event covers writes from this tab.
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
};

// Subscribes to the raw string (stable between renders) and parses it in the caller.
export const useStoredJson = <T>(key: string | null): T | null => {
  const getSnapshot = useCallback(() => (key ? read(key) : null), [key]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};
