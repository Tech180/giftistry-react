import React, { useId } from 'react';
import { BadgeProps } from './interfaces/badge-props.interface';
import { BadgeTemplate } from './badge.html';
import styles from './badge.module.css';

export type { BadgeProps, BadgeSize, BadgeEffect } from './interfaces/badge-props.interface';

export const Badge: React.FC<BadgeProps> = ({
  children,
  icon,
  iconInactive,
  active = false,
  effect = 'none',
  size = 'md',
  onClick,
  disabled = false,
  ariaLabel,
  ariaPressed,
  className = '',
  gradientId: gradientIdProp,
}) => {
  const rawId = useId().replace(/:/g, '');
  const gradientId =
    effect === 'rainbow' ? (gradientIdProp ?? `badge-gradient-${rawId}`) : undefined;

  const rootClass = [
    styles.root,
    styles[`size-${size}`],
    active ? styles.active : '',
    effect === 'rainbow' ? styles['effect-rainbow'] : '',
    onClick ? styles.interactive : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <BadgeTemplate
      rootClass={rootClass}
      icon={icon}
      iconInactive={iconInactive}
      active={active}
      effect={effect}
      size={size}
      onClick={onClick}
      disabled={disabled}
      ariaLabel={ariaLabel}
      ariaPressed={ariaPressed}
      gradientId={gradientId}
    >
      {children}
    </BadgeTemplate>
  );
};
