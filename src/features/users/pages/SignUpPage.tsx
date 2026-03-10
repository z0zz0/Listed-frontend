import { SignupWizard } from '@/features/users/ui/SignupWizard';
import styles from '@/features/users/pages/SignUpPage.module.scss';

export function SignUpPage() {
  return (
    <section className={styles.signup}>
      <div className={styles.heroGlow} aria-hidden />

      <div className={styles.signupCard}>
        <SignupWizard />
      </div>
    </section>
  );
}
