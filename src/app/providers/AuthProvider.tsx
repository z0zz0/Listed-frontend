import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

import { getAuthSession } from '@/features/auth/api/getAuthSession';
import { login as loginRequest } from '@/features/auth/api/login';
import { logout as logoutRequest } from '@/features/auth/api/logout';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { authStatus, type AuthContextValue, type AuthSession, type AuthStatus, type LoginInput } from '@/features/auth/model/auth.types';
import { clearAccessToken, ensureAccessToken, setAccessToken } from '@/shared/api/httpClient';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>(authStatus.anonymous);
  const hydrateSessionInFlightRef = useRef<Promise<void> | null>(null);

  const authenticateWithAccessToken = useCallback(async (accessTokenValue: string) => {
    setStatus(authStatus.loading);

    try {
      setAccessToken(accessTokenValue);
      const nextSession = await getAuthSession();
      setSession(nextSession);
      setStatus(authStatus.authenticated);
    } catch (error) {
      clearAccessToken();
      setSession(null);
      setStatus(authStatus.anonymous);
      throw error;
    }
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      setStatus(authStatus.loading);

      try {
        const accessTokenResult = await loginRequest(input);
        await authenticateWithAccessToken(accessTokenResult.accessToken);
      } catch (error) {
        clearAccessToken();
        setSession(null);
        setStatus(authStatus.anonymous);
        throw error;
      }
    },
    [authenticateWithAccessToken],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearAccessToken();
      setSession(null);
      setStatus(authStatus.anonymous);
    }
  }, []);

  const hydrateSession = useCallback(async () => {
    if (hydrateSessionInFlightRef.current) {
      return hydrateSessionInFlightRef.current;
    }

    const inFlightPromise = (async () => {
      setStatus(authStatus.loading);

      try {
        const hydratedAccessToken = await ensureAccessToken();

        if (!hydratedAccessToken) {
          clearAccessToken();
          setSession(null);
          setStatus(authStatus.anonymous);
          return;
        }

        const nextSession = await getAuthSession();
        setSession(nextSession);
        setStatus(authStatus.authenticated);
      } catch {
        clearAccessToken();
        setSession(null);
        setStatus(authStatus.anonymous);
      }
    })();

    hydrateSessionInFlightRef.current = inFlightPromise.finally(() => {
      hydrateSessionInFlightRef.current = null;
    });

    return hydrateSessionInFlightRef.current;
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      session,
      status,
      login,
      authenticateWithAccessToken,
      logout,
      hydrateSession,
    }),
    [session, status, login, authenticateWithAccessToken, logout, hydrateSession],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
