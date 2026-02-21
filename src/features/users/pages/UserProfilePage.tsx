import { useAuth } from '@/features/auth/hooks/useAuth';
import styles from '@/pages/Pages.module.scss';

export function UserProfilePage() {
  const { session } = useAuth();

  return (
    <section className={styles.page}>
      <h1>User Profile</h1>
      <p>This route is protected and only available to authenticated users.</p>
      <p>Current session user: {session?.email ?? 'unknown'}</p>
    </section>
  );
}
