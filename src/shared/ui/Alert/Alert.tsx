import type { ReactNode } from 'react';

import styles from '@/shared/ui/Alert/Alert.module.scss';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
}

export function Alert({ children, variant = 'info' }: AlertProps) {
  return <div className={[styles.alert, styles[variant]].join(' ')}>{children}</div>;
}
