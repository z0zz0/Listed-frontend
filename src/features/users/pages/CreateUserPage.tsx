import { CreateUserForm } from '@/features/users/ui/CreateUserForm';
import styles from '@/features/users/pages/UsersPages.module.scss';

export function CreateUserPage() {
  return (
    <section className={styles.page}>
      <h1>Create User</h1>
      <p>Create a user account with email and password.</p>
      <CreateUserForm />
    </section>
  );
}
