import { NavLink, Outlet } from 'react-router-dom';

import { routePaths } from '@/app/router/paths';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authStatus } from '@/features/auth/model/auth.types';
import styles from '@/app/router/root-layout.module.scss';

export function RootLayout() {
  const { session, status } = useAuth();
  const isAuthenticated = status === authStatus.authenticated && session !== null;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>Listed Frontend</div>
        <nav className={styles.nav}>
          {!isAuthenticated ? (
            <>
              <NavLink to={routePaths.home} className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} end>
                Home
              </NavLink>
              <NavLink
                to={routePaths.signup}
                className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={routePaths.users.me}
                className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
              >
                My Page
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
