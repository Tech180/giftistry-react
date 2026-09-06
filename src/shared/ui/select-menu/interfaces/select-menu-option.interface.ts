import type { ReactNode } from 'react';

export interface SelectMenuOption {
  value: string;
  label: string;
  description?: string;
  /** Leading icon when not selected; selected shows a checkmark. */
  icon?: ReactNode;
  disabled?: boolean;
}
