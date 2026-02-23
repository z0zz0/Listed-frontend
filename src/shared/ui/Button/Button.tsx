import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { t } from '@/shared/i18n';
import styles from '@/shared/ui/Button/Button.module.scss';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export function Button({ children, variant = 'primary', isLoading = false, className, ...props }: ButtonProps) {
  const classNames = [styles.button, styles[variant], className].filter(Boolean).join(' ');

  return (
    <button {...props} className={classNames} disabled={isLoading || props.disabled}>
      {isLoading ? t('common.button.pleaseWait') : children}
    </button>
  );
}
