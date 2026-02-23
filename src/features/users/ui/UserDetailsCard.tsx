import type { User } from '@/features/users/model/user.types';
import { t } from '@/shared/i18n';
import styles from '@/features/users/ui/UserDetailsCard.module.scss';

interface UserDetailsCardProps {
  user: User;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3>{t('users.details.title')}</h3>
        <p>{user.email}</p>
      </header>

      <dl className={styles.details}>
        <div>
          <dt>{t('users.details.id')}</dt>
          <dd>{user.id}</dd>
        </div>
        <div>
          <dt>{t('users.details.verified')}</dt>
          <dd>
            {user.isVerified === null
              ? t('common.value.unknown')
              : user.isVerified
                ? t('common.value.yes')
                : t('common.value.no')}
          </dd>
        </div>
        <div>
          <dt>{t('users.details.softDeleted')}</dt>
          <dd>{user.isSoftDeleted ? t('common.value.yes') : t('common.value.no')}</dd>
        </div>
      </dl>

      {user.userInfo ? (
        <section className={styles.section}>
          <h4>{t('users.details.profile')}</h4>
          <p>
            {user.userInfo.firstName} {user.userInfo.lastName}
          </p>
          <p>{user.userInfo.phoneNumber}</p>
          <p>{user.userInfo.nationality}</p>
          {user.userInfo.biography ? <p>{user.userInfo.biography}</p> : null}
        </section>
      ) : (
        <section className={styles.section}>
          <h4>{t('users.details.profile')}</h4>
          <p>{t('users.details.noProfileInformation')}</p>
        </section>
      )}

      <section className={styles.section}>
        <h4>{t('users.details.photos', { count: user.photos.length })}</h4>
        {user.photos.length > 0 ? (
          <ul className={styles.photoList}>
            {[...user.photos]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((photo) => (
                <li key={photo.id}>
                  <a href={photo.url} target="_blank" rel="noreferrer">
                    {t('users.details.photoLabel', { index: photo.sortOrder + 1 })}
                  </a>{' '}
                  {t('users.details.photoUploaded', { date: photo.uploadedAt.toLocaleDateString() })}
                </li>
              ))}
          </ul>
        ) : (
          <p>{t('users.details.noPhotosUploaded')}</p>
        )}
      </section>
    </article>
  );
}
