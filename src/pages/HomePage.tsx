import { Link } from 'react-router-dom';

import styles from '@/pages/Pages.module.scss';

export function HomePage() {
  return (
    <section className={styles.page}>
      <h1>Listed Frontend</h1>
      <p>This frontend currently implements the users feature module.</p>
      <ul className={styles.links}>
        <li>
          <Link to="/users/new">Create a user</Link>
        </li>
        <li>
          <Link to="/users/by-email">Find user by email</Link>
        </li>
      </ul>
    </section>
  );
}
