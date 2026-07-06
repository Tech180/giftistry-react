import { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  leftIconClickable?: boolean;
  /** Borderless inner field for use inside an `.input-panel` wrapper */
  variant?: 'default' | 'inline';
}
