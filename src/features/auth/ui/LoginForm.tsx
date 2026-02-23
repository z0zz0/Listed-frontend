import { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { routePaths } from '@/app/router/paths';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/features/auth/model/auth.schemas';
import { getErrorMessage } from '@/shared/api/apiError';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import styles from '@/features/auth/ui/LoginForm.module.scss';

export function LoginForm() {
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await login({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Login failed. Please check your credentials and try again.'));
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Input
        label="User"
        placeholder="Email address"
        autoComplete="username"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        {...register('password')}
        error={errors.password?.message}
      />

      {submitError ? <Alert variant="error">{submitError}</Alert> : null}

      <Button type="submit" className={styles.submitButton} isLoading={isSubmitting}>
        Log in
      </Button>

      <p className={styles.metaRow}>
        Need an account?{' '}
        <Link to={routePaths.signup} className={styles.signupLink}>
          Sign up
        </Link>
      </p>
    </form>
  );
}
