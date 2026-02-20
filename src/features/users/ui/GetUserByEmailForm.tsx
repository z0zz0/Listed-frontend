import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUserByEmailQuery } from '@/features/users/hooks/useUserByEmailQuery';
import { getUserByEmailSchema, type GetUserByEmailFormValues } from '@/features/users/model/user.schemas';
import { UserDetailsCard } from '@/features/users/ui/UserDetailsCard';
import { getErrorMessage } from '@/shared/api/apiError';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import styles from '@/features/users/ui/UserForms.module.scss';

export function GetUserByEmailForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const query = useUserByEmailQuery(submittedEmail);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GetUserByEmailFormValues>({
    resolver: zodResolver(getUserByEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    setSubmittedEmail(values.email);
  });

  return (
    <section className={styles.card}>
      <form onSubmit={onSubmit} className={styles.form} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Button type="submit" isLoading={query.isFetching}>
          Search User
        </Button>
      </form>

      {query.isError ? <Alert variant="error">{getErrorMessage(query.error)}</Alert> : null}
      {query.isSuccess ? <UserDetailsCard user={query.data} /> : null}
    </section>
  );
}
