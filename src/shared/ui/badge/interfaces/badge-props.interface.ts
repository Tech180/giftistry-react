import { ReactNode, MouseEventHandler } from 'react';
import type { BadgeEffect } from './badge-effect.type';
import type { BadgeSize } from './badge-size.type';
import type { BadgeTone } from './badge-tone.type';

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
