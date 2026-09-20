import { ReactNode, MouseEventHandler } from 'react';

export interface BadgeTemplateProps {
  children?: ReactNode;
  rootClass: string;
  borderWrapperClass: string;
  borderGradientClass: string;
  showBorderGradient: boolean;
  innerClass: string;
  hasIcon: boolean;
  iconSlotClass: string;
  showActiveIcon: boolean;
  activeIconClass: string;
  showInactiveIcon: boolean;
  inactiveIconClass: string;
  showLabel: boolean;
  labelClass: string;
  showDefs: boolean;
  gradientId?: string;
  icon?: ReactNode;
  iconInactive?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
}
