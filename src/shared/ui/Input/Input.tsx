import { forwardRef, type InputHTMLAttributes } from 'react';

import styles from '@/shared/ui/Input/Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  const classNames = [styles.input, className].filter(Boolean).join(' ');

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input {...props} id={inputId} ref={ref} className={classNames} aria-invalid={Boolean(error)} />
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
});
