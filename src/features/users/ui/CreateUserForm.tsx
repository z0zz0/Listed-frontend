import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateUserMutation } from '@/features/users/hooks/useCreateUserMutation';
import { createUserSchema, type CreateUserFormValues } from '@/features/users/model/user.schemas';
import type { CreateUserResult } from '@/features/users/model/user.types';
import { getErrorMessage } from '@/shared/api/apiError';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import styles from '@/features/users/ui/UserForms.module.scss';

export function CreateUserForm() {
  const mutation = useCreateUserMutation();
  const [createdUser, setCreatedUser] = useState<CreateUserResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setCreatedUser(null);

    try {
      const result = await mutation.mutateAsync(values);
      setCreatedUser(result);
      reset();
    } catch {
      // The mutation error state is rendered below.
    }
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
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
        />

        <Button type="submit" isLoading={mutation.isPending}>
          Create User
        </Button>
      </form>

      {mutation.isError ? <Alert variant="error">{getErrorMessage(mutation.error)}</Alert> : null}

      {createdUser ? (
        <Alert variant="success">Created user {createdUser.email} with id {createdUser.id}</Alert>
      ) : null}
    </section>
  );
}
