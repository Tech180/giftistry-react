import { ReactNode, MouseEventHandler } from 'react';
import type { BadgeEffect, BadgeSize } from './badge-props.interface';

export interface BadgeTemplateProps {
  children?: ReactNode;
  rootClass: string;
  icon?: ReactNode;
  iconInactive?: ReactNode;
  active?: boolean;
  effect?: BadgeEffect;
  size?: BadgeSize;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  gradientId?: string;
}
