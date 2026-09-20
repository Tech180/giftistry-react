import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonTemplateProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'className'> {
  children?: ReactNode;
  buttonClass: string;
  innerClass: string;
  showRainbow: boolean;
  showDefs: boolean;
  showSpinner: boolean;
  showLeftIcon: boolean;
  showRightIcon: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  gradientId?: string;
  disabled?: boolean;
}
