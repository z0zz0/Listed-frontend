import { Navigate, Outlet } from 'react-router-dom';

import { routePaths } from '@/app/router/paths';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authStatus } from '@/features/auth/model/auth.types';

export function RedirectIfAuthenticated() {
  const { session, status } = useAuth();

  if (status === authStatus.loading) {
    return <p>Checking session...</p>;
  }

  if (status === authStatus.authenticated && session) {
    return <Navigate to={routePaths.users.me} replace />;
  }

  return <Outlet />;
}
