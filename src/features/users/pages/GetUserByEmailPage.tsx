import { GetUserByEmailForm } from '@/features/users/ui/GetUserByEmailForm';
import styles from '@/features/users/pages/UsersPages.module.scss';

export function GetUserByEmailPage() {
  return (
    <section className={styles.page}>
      <h1>Find User By Email</h1>
      <p>Search for an existing user and inspect details returned by the backend.</p>
      <GetUserByEmailForm />
    </section>
  );
}
