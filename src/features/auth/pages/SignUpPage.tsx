import { t } from '@/shared/i18n';
import styles from '@/pages/Pages.module.scss';

export function SignUpPage() {
  return (
    <section className={styles.page}>
      <h1>{t('auth.signup.title')}</h1>
      <p>{t('auth.signup.todo')}</p>
      <p>{t('auth.signup.publicInfo')}</p>
    </section>
  );
}
