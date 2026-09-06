import { ReactNode, MouseEventHandler } from 'react';

export type BadgeSize = 'sm' | 'md' | 'compact';
export type BadgeEffect = 'none' | 'rainbow';
export type BadgeTone = 'default' | 'success';

export interface BadgeProps {
  children?: ReactNode;
  icon?: ReactNode;
  iconInactive?: ReactNode;
  active?: boolean;
  effect?: BadgeEffect;
  tone?: BadgeTone;
  size?: BadgeSize;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  className?: string;
  /** Optional gradient id for rainbow effect icons (shared with SVG defs). */
  gradientId?: string;
}
