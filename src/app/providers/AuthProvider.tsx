import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { AuthContext } from '@/features/auth/context/AuthContext';
import type { AuthContextValue, AuthSession, AuthStatus, LoginInput } from '@/features/auth/model/auth.types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('anonymous');

  const login = useCallback(async (input: LoginInput) => {
    setStatus('loading');
    setSession({
      userId: 'local-dev-user',
      email: input.email,
    });
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    setStatus('anonymous');
  }, []);

  const refreshSession = useCallback(async () => {
    // Placeholder for upcoming auth backend integration.
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      session,
      status,
      login,
      logout,
      refreshSession,
    }),
    [session, status, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
