import { forwardRef, useId, type InputHTMLAttributes } from 'react';

import styles from '@/shared/ui/Input/Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, 'aria-describedby': ariaDescribedBy, ...props },
  ref,
) {
  const generatedId = useId().replace(/:/g, '');
  const inputId = id ?? props.name ?? `input-${generatedId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
  const classNames = [styles.input, className].filter(Boolean).join(' ');

  return (
    <div className={styles.field}>
      <div className={styles.control}>
        <input
          {...props}
          id={inputId}
          ref={ref}
          className={classNames}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
});
