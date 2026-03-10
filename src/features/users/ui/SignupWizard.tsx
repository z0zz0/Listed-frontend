import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSignupFlow } from '@/features/users/hooks/useSignupFlow';
import {
  completeSignupSchema,
  saveSignupProfileSchema,
  startSignupSchema,
  type CompleteSignupFormValues,
  type SaveSignupProfileFormValues,
  type StartSignupFormValues,
  type VerifySignupEmailFormValues,
  verifySignupEmailSchema,
} from '@/features/users/model/signup.schemas';
import { signupSteps } from '@/features/users/model/signup.types';
import { getErrorMessage } from '@/shared/api/apiError';
import { t, tMaybeKey } from '@/shared/i18n';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import { IconArrowLeft } from '@/shared/ui/Svg/IconArrowLeft';
import { Input } from '@/shared/ui/Input/Input';
import styles from '@/features/users/ui/SignupWizard.module.scss';

const signupStepSequence = [signupSteps.start, signupSteps.verifyCode, signupSteps.personalInfo, signupSteps.complete] as const;

function formatUtcDateTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  return {
    year: match[1],
    month: String(Number(match[2])),
    day: String(Number(match[3])),
  };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function SignupWizard() {
  const { authenticateWithAccessToken } = useAuth();
  const { state, goBack, submitStart, submitVerifyCode, submitPersonalInfo, submitComplete } = useSignupFlow();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepNumber = signupStepSequence.indexOf(state.step) + 1;
  const codeExpiresAtFormatted = useMemo(() => formatUtcDateTime(state.codeExpiresAtUtc), [state.codeExpiresAtUtc]);
  const today = useMemo(() => new Date(), []);

  const startForm = useForm<StartSignupFormValues>({
    resolver: zodResolver(startSignupSchema),
    defaultValues: {
      email: '',
    },
  });

  const verifyCodeForm = useForm<VerifySignupEmailFormValues>({
    resolver: zodResolver(verifySignupEmailSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const profileForm = useForm<SaveSignupProfileFormValues>({
    resolver: zodResolver(saveSignupProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
    },
  });
  const [birthMonth, setBirthMonth] = useState(() => parseIsoDate(profileForm.getValues('dateOfBirth'))?.month ?? '');
  const [birthDay, setBirthDay] = useState(() => parseIsoDate(profileForm.getValues('dateOfBirth'))?.day ?? '');
  const [birthYear, setBirthYear] = useState(() => parseIsoDate(profileForm.getValues('dateOfBirth'))?.year ?? '');
  const dateOfBirthError = tMaybeKey(profileForm.formState.errors.dateOfBirth?.message);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const birthYears = useMemo(() => Array.from({ length: 101 }, (_, index) => String(currentYear - index)), [currentYear]);
  const maxMonth = birthYear && Number(birthYear) === currentYear ? currentMonth : 12;
  const birthMonths = useMemo(
    () =>
      Array.from({ length: maxMonth }, (_, index) => ({
        value: String(index + 1),
        label: new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2000, index, 1)),
      })),
    [maxMonth],
  );
  const maxDay = useMemo(() => {
    if (!birthMonth) {
      return 31;
    }

    const month = Number(birthMonth);
    const year = birthYear ? Number(birthYear) : currentYear;
    const daysInMonth = getDaysInMonth(year, month);

    if (year === currentYear && month === currentMonth) {
      return Math.min(daysInMonth, currentDay);
    }

    return daysInMonth;
  }, [birthMonth, birthYear, currentDay, currentMonth, currentYear]);
  const birthDays = useMemo(() => Array.from({ length: maxDay }, (_, index) => String(index + 1)), [maxDay]);

  useEffect(() => {
    if (birthMonth && Number(birthMonth) > maxMonth) {
      setBirthMonth('');
      setBirthDay('');
    }
  }, [birthMonth, maxMonth]);

  useEffect(() => {
    if (birthDay && Number(birthDay) > maxDay) {
      setBirthDay('');
    }
  }, [birthDay, maxDay]);

  useEffect(() => {
    if (!birthYear || !birthMonth || !birthDay) {
      if (profileForm.getValues('dateOfBirth')) {
        profileForm.setValue('dateOfBirth', '', { shouldDirty: true });
      }
      return;
    }

    const isoDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
    if (profileForm.getValues('dateOfBirth') !== isoDate) {
      profileForm.setValue('dateOfBirth', isoDate, { shouldDirty: true });
    }
  }, [birthYear, birthMonth, birthDay, profileForm]);

  const completeForm = useForm<CompleteSignupFormValues>({
    resolver: zodResolver(completeSignupSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onStartSubmit = startForm.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await submitStart(values.email);
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'users.signup.error.startFailed'));
    }
  });

  const onVerifyCodeSubmit = verifyCodeForm.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await submitVerifyCode(values.verificationCode);
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'users.signup.error.verifyFailed'));
    }
  });

  const onPersonalInfoSubmit = profileForm.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await submitPersonalInfo(values.firstName, values.lastName, values.dateOfBirth);
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'users.signup.error.personalInfoFailed'));
    }
  });

  const onCompleteSubmit = completeForm.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const response = await submitComplete(values.password);
      await authenticateWithAccessToken(response.accessToken.accessToken);
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'users.signup.error.completeFailed'));
    }
  });

  return (
    <section className={styles.wrapper} aria-label={t('users.signup.title')}>
      {stepNumber > 1 ? (
        <button type="button" className={styles.backFloatingButton} onClick={goBack} aria-label={t('users.signup.step.back')}>
          <IconArrowLeft className={styles.backArrowIcon} />
        </button>
      ) : null}

      {state.step === signupSteps.start ? (
        <form className={styles.form} onSubmit={onStartSubmit} noValidate>
          <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>{t('users.signup.step.start.title')}</h2>
            <p className={styles.stepBadge}>{t('users.signup.step.progress', { current: stepNumber, total: signupStepSequence.length })}</p>
          </div>
          <p className={styles.stepDescription}>{t('users.signup.step.start.description')}</p>

          <Input
            label={t('users.signup.form.emailLabel')}
            type="email"
            autoComplete="email"
            {...startForm.register('email')}
            error={tMaybeKey(startForm.formState.errors.email?.message)}
          />

          {submitError ? <Alert variant="error">{submitError}</Alert> : null}

          <Button type="submit" className={styles.submitButton} isLoading={startForm.formState.isSubmitting}>
            {t('users.signup.step.start.submit')}
          </Button>
        </form>
      ) : null}

      {state.step === signupSteps.verifyCode ? (
        <form className={styles.form} onSubmit={onVerifyCodeSubmit} noValidate>
          <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>{t('users.signup.step.verify.title')}</h2>
            <p className={styles.stepBadge}>{t('users.signup.step.progress', { current: stepNumber, total: signupStepSequence.length })}</p>
          </div>
          <p className={styles.stepDescription}>{t('users.signup.step.verify.description')}</p>

          {state.email ? <Alert variant="info">{t('users.signup.step.verify.codeSentTo', { email: state.email })}</Alert> : null}
          {codeExpiresAtFormatted ? (
            <p className={styles.metaText}>{t('users.signup.step.verify.codeExpiresAt', { expiresAt: codeExpiresAtFormatted })}</p>
          ) : null}

          <Input
            label={t('users.signup.form.verificationCodeLabel')}
            placeholder={t('users.signup.form.verificationCodePlaceholder')}
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            {...verifyCodeForm.register('verificationCode')}
            error={tMaybeKey(verifyCodeForm.formState.errors.verificationCode?.message)}
          />

          {submitError ? <Alert variant="error">{submitError}</Alert> : null}

          <Button type="submit" className={styles.submitButton} isLoading={verifyCodeForm.formState.isSubmitting}>
            {t('users.signup.step.verify.submit')}
          </Button>
        </form>
      ) : null}

      {state.step === signupSteps.personalInfo ? (
        <form className={styles.form} onSubmit={onPersonalInfoSubmit} noValidate>
          <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>{t('users.signup.step.personalInfo.title')}</h2>
            <p className={styles.stepBadge}>{t('users.signup.step.progress', { current: stepNumber, total: signupStepSequence.length })}</p>
          </div>
          <p className={styles.stepDescription}>{t('users.signup.step.personalInfo.description')}</p>

          <Input
            label={t('users.signup.form.firstNameLabel')}
            type="text"
            autoComplete="given-name"
            {...profileForm.register('firstName')}
            error={tMaybeKey(profileForm.formState.errors.firstName?.message)}
          />

          <Input
            label={t('users.signup.form.lastNameLabel')}
            type="text"
            autoComplete="family-name"
            {...profileForm.register('lastName')}
            error={tMaybeKey(profileForm.formState.errors.lastName?.message)}
          />

          <div className={styles.emailField}>
            <p className={styles.birthLabel}>{t('users.signup.form.dateOfBirthSimpleLabel')}</p>
            <div className={styles.dateOfBirthGrid}>
              <select
                value={birthYear}
                onChange={(event) => setBirthYear(event.target.value)}
                className={`${styles.birthSelect} ${birthYear ? '' : styles.birthSelectPlaceholder}`}
                aria-label={t('users.signup.form.birthYearLabel')}
                aria-invalid={Boolean(profileForm.formState.errors.dateOfBirth)}
              >
                <option value="" disabled hidden>
                  {t('users.signup.form.birthYearPlaceholder')}
                </option>
                {birthYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={birthMonth}
                onChange={(event) => setBirthMonth(event.target.value)}
                className={`${styles.birthSelect} ${birthMonth ? '' : styles.birthSelectPlaceholder}`}
                aria-label={t('users.signup.form.birthMonthLabel')}
                aria-invalid={Boolean(profileForm.formState.errors.dateOfBirth)}
              >
                <option value="" disabled hidden>
                  {t('users.signup.form.birthMonthPlaceholder')}
                </option>
                {birthMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>

              <select
                value={birthDay}
                onChange={(event) => setBirthDay(event.target.value)}
                className={`${styles.birthSelect} ${birthDay ? '' : styles.birthSelectPlaceholder}`}
                aria-label={t('users.signup.form.birthDayLabel')}
                aria-invalid={Boolean(profileForm.formState.errors.dateOfBirth)}
              >
                <option value="" disabled hidden>
                  {t('users.signup.form.birthDayPlaceholder')}
                </option>
                {birthDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            {dateOfBirthError ? <p className={styles.emailError}>{dateOfBirthError}</p> : null}
          </div>

          {submitError ? <Alert variant="error">{submitError}</Alert> : null}

          <Button type="submit" className={styles.submitButton} isLoading={profileForm.formState.isSubmitting}>
            {t('users.signup.step.personalInfo.submit')}
          </Button>
        </form>
      ) : null}

      {state.step === signupSteps.complete ? (
        <form className={styles.form} onSubmit={onCompleteSubmit} noValidate>
          <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>{t('users.signup.step.complete.title')}</h2>
            <p className={styles.stepBadge}>{t('users.signup.step.progress', { current: stepNumber, total: signupStepSequence.length })}</p>
          </div>
          <p className={styles.stepDescription}>{t('users.signup.step.complete.description')}</p>

          <Input
            label={t('users.signup.form.passwordLabel')}
            type="password"
            placeholder={t('users.signup.form.passwordPlaceholder')}
            autoComplete="new-password"
            {...completeForm.register('password')}
            error={tMaybeKey(completeForm.formState.errors.password?.message)}
          />

          <Input
            label={t('users.signup.form.confirmPasswordLabel')}
            type="password"
            placeholder={t('users.signup.form.confirmPasswordPlaceholder')}
            autoComplete="new-password"
            {...completeForm.register('confirmPassword')}
            error={tMaybeKey(completeForm.formState.errors.confirmPassword?.message)}
          />

          {submitError ? <Alert variant="error">{submitError}</Alert> : null}

          <Button type="submit" className={styles.submitButton} isLoading={completeForm.formState.isSubmitting}>
            {t('users.signup.step.complete.submit')}
          </Button>
        </form>
      ) : null}

    </section>
  );
}
