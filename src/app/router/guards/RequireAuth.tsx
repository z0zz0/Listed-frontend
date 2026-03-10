import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { routePaths } from '@/app/router/paths';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authStatus } from '@/features/auth/model/auth.types';
import { t } from '@/shared/i18n';

export function RequireAuth() {
  const { session, status, hydrateSession } = useAuth();
  const location = useLocation();
  const [hasAttemptedHydration, setHasAttemptedHydration] = useState(false);

  useEffect(() => {
    if (hasAttemptedHydration || status !== authStatus.anonymous || session) {
      return;
    }

    setHasAttemptedHydration(true);
    void hydrateSession();
  }, [hasAttemptedHydration, hydrateSession, session, status]);

  if (status === authStatus.loading || (!hasAttemptedHydration && status === authStatus.anonymous && !session)) {
    return <p>{t('common.status.checkingSession')}</p>;
  }

  if (status !== authStatus.authenticated || !session) {
    return <Navigate to={routePaths.home} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
