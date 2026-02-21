import { Link } from 'react-router-dom';

import { routePaths } from '@/app/router/paths';
import styles from '@/pages/Pages.module.scss';

export function HomePage() {
  return (
    <section className={styles.page}>
      <h1>Welcome Back</h1>
      <p>This is the public front page. Login form is implemented in the next phase.</p>
      <ul className={styles.links}>
        <li>
          <Link to={routePaths.signup}>Create an account</Link>
        </li>
      </ul>
    </section>
  );
}
