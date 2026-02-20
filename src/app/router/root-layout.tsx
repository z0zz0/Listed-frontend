import { NavLink, Outlet } from 'react-router-dom';

import styles from '@/app/router/root-layout.module.scss';

export function RootLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>Listed Frontend</div>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} end>
            Home
          </NavLink>
          <NavLink to="/users/new" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            Create User
          </NavLink>
          <NavLink
            to="/users/by-email"
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Find User
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
