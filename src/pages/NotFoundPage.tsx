import { Link } from 'react-router-dom';

import { routePaths } from '@/app/router/paths';
import { t } from '@/shared/i18n';
import styles from '@/pages/Pages.module.scss';

export function NotFoundPage() {
  return (
    <section className={styles.page}>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.description')}</p>
      <Link to={routePaths.home}>{t('notFound.returnHome')}</Link>
    </section>
  );
}

