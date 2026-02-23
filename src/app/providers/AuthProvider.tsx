import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getMe } from '@/features/auth/api/getMe';
import { login as loginRequest } from '@/features/auth/api/login';
import { logout as logoutRequest } from '@/features/auth/api/logout';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { authStatus, type AuthContextValue, type AuthSession, type AuthStatus, type LoginInput } from '@/features/auth/model/auth.types';
import { clearAccessToken, setAccessToken } from '@/shared/api/httpClient';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>(authStatus.loading);

  const login = useCallback(async (input: LoginInput) => {
    setStatus(authStatus.loading);

    try {
      const accessTokenResult = await loginRequest(input);
      setAccessToken(accessTokenResult.accessToken);
      const nextSession = await getMe();

      setSession(nextSession);
      setStatus(authStatus.authenticated);
    } catch (error) {
      clearAccessToken();
      setSession(null);
      setStatus(authStatus.anonymous);
      throw error;
    }
  }, []);

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
    setStatus(authStatus.loading);

    try {
      const nextSession = await getMe();
      setSession(nextSession);
      setStatus(authStatus.authenticated);
    } catch {
      clearAccessToken();
      setSession(null);
      setStatus(authStatus.anonymous);
    }
  }, []);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      session,
      status,
      login,
      logout,
      hydrateSession,
    }),
    [session, status, login, logout, hydrateSession],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
