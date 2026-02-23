import { LoginForm } from '@/features/auth/ui/LoginForm';
import { t } from '@/shared/i18n';
import styles from '@/pages/HomePage.module.scss';

export function HomePage() {
  return (
    <section className={styles.home}>
      <div className={styles.heroGlow} aria-hidden />

      <div className={styles.loginCard}>
        <p className={styles.brand}>{t('home.brand')}</p>
        <h1 className={styles.title}>{t('home.title')}</h1>
        <p className={styles.subtitle}>{t('home.subtitle')}</p>

        <LoginForm />
      </div>
    </section>
  );
}
