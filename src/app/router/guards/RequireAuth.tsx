import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { routePaths } from '@/app/router/paths';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authStatus } from '@/features/auth/model/auth.types';

export function RequireAuth() {
  const { session, status } = useAuth();
  const location = useLocation();

  if (status === authStatus.loading) {
    return <p>Checking session...</p>;
  }

  if (status !== authStatus.authenticated || !session) {
    return <Navigate to={routePaths.home} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
