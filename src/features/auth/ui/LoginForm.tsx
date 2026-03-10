import { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { routePaths } from '@/app/router/paths';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/features/auth/model/auth.schemas';
import { getErrorMessage } from '@/shared/api/apiError';
import { t, tMaybeKey } from '@/shared/i18n';
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
      setSubmitError(getErrorMessage(error, 'error.auth.loginFailed'));
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Input
        label={t('auth.login.form.userLabel')}
        placeholder={t('auth.login.form.emailPlaceholder')}
        autoComplete="username"
        {...register('email')}
        error={tMaybeKey(errors.email?.message)}
      />

      <Input
        label={t('auth.login.form.passwordLabel')}
        type="password"
        placeholder={t('auth.login.form.passwordPlaceholder')}
        autoComplete="current-password"
        {...register('password')}
        error={tMaybeKey(errors.password?.message)}
      />

      {submitError ? <Alert variant="error">{submitError}</Alert> : null}

      <Button type="submit" className={styles.submitButton} isLoading={isSubmitting}>
        {t('auth.login.form.submit')}
      </Button>

      <button type="button" className={styles.forgotPasswordButton}>
        {t('auth.login.form.forgotPassword')}
      </button>

      <Link to={routePaths.signup} className={styles.createAccountButton}>
        {t('auth.login.form.createAccount')}
      </Link>
    </form>
  );
}
