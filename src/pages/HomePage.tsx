import { LoginForm } from '@/features/auth/ui/LoginForm';
import styles from '@/pages/HomePage.module.scss';

export function HomePage() {
  return (
    <section className={styles.home}>
      <div className={styles.heroGlow} aria-hidden />

      <div className={styles.loginCard}>
        <p className={styles.brand}>Listed</p>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue to your account.</p>

        <LoginForm />
      </div>
    </section>
  );
}
