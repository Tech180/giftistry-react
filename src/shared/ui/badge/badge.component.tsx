import React from 'react';
import { BadgeProps } from './interfaces/badge-props.interface';
import { BadgeTemplate } from './badge.html';
import styles from './badge.module.css';

export type { BadgeProps } from './interfaces/badge-props.interface';
export type { BadgeVariant } from './interfaces/badge-variant.interface';

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const badgeClass = [styles.badge, styles[variant], className].filter(Boolean).join(' ');

  return <BadgeTemplate badgeClass={badgeClass}>{children}</BadgeTemplate>;
};
