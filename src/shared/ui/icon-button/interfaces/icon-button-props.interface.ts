import { ReactNode } from 'react';
import { IconButtonVariant } from './icon-button-variant.interface';
import { IconButtonSize } from './icon-button-size.interface';

export interface IconButtonProps {
  icon: ReactNode;
  ariaLabel: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
