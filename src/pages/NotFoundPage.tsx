import { Link } from 'react-router-dom';

import { routePaths } from '@/app/router/paths';
import styles from '@/pages/Pages.module.scss';

export function NotFoundPage() {
  return (
    <section className={styles.page}>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to={routePaths.home}>Return to Home</Link>
    </section>
  );
}
