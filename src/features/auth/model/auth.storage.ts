import type { AuthSession } from '@/features/auth/model/auth.types';

export const AUTH_SESSION_STORAGE_KEY = 'listed.auth.session';

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<AuthSession>;

  return typeof candidate.userId === 'string' && typeof candidate.email === 'string';
}

export function readStoredAuthSession(): AuthSession | null {
  if (!hasLocalStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isAuthSession(parsedValue)) {
      window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

export function writeStoredAuthSession(session: AuthSession) {
  if (!hasLocalStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession() {
  if (!hasLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
