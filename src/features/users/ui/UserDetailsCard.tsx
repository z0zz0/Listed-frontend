import type { User } from '@/features/users/model/user.types';
import styles from '@/features/users/ui/UserDetailsCard.module.scss';

interface UserDetailsCardProps {
  user: User;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3>User Details</h3>
        <p>{user.email}</p>
      </header>

      <dl className={styles.details}>
        <div>
          <dt>ID</dt>
          <dd>{user.id}</dd>
        </div>
        <div>
          <dt>Verified</dt>
          <dd>{user.isVerified === null ? 'Unknown' : user.isVerified ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt>Soft Deleted</dt>
          <dd>{user.isSoftDeleted ? 'Yes' : 'No'}</dd>
        </div>
      </dl>

      {user.userInfo ? (
        <section className={styles.section}>
          <h4>Profile</h4>
          <p>
            {user.userInfo.firstName} {user.userInfo.lastName}
          </p>
          <p>{user.userInfo.phoneNumber}</p>
          <p>{user.userInfo.nationality}</p>
          {user.userInfo.biography ? <p>{user.userInfo.biography}</p> : null}
        </section>
      ) : (
        <section className={styles.section}>
          <h4>Profile</h4>
          <p>No profile information.</p>
        </section>
      )}

      <section className={styles.section}>
        <h4>Photos ({user.photos.length})</h4>
        {user.photos.length > 0 ? (
          <ul className={styles.photoList}>
            {[...user.photos]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((photo) => (
                <li key={photo.id}>
                  <a href={photo.url} target="_blank" rel="noreferrer">
                    Photo #{photo.sortOrder + 1}
                  </a>{' '}
                  uploaded {photo.uploadedAt.toLocaleDateString()}
                </li>
              ))}
          </ul>
        ) : (
          <p>No photos uploaded.</p>
        )}
      </section>
    </article>
  );
}
