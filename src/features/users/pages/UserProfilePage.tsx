import { useAuth } from '@/features/auth/hooks/useAuth';
import { t } from '@/shared/i18n';
import styles from '@/pages/Pages.module.scss';

export function UserProfilePage() {
  const { session } = useAuth();

  return (
    <section className={styles.page}>
      <h1>{t('users.profile.title')}</h1>
      <p>{t('users.profile.protectedDescription')}</p>
      <p>{t('users.profile.currentSessionUser', { email: session?.email ?? t('common.value.unknown') })}</p>
    </section>
  );
}
