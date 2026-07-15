import React from 'react';
import { BadgeTemplateProps } from './interfaces/badge-template-props.interface';
import styles from './badge.module.css';

export const BadgeTemplate: React.FC<BadgeTemplateProps> = ({
  children,
  rootClass,
  icon,
  iconInactive,
  active = false,
  effect = 'none',
  onClick,
  disabled = false,
  ariaLabel,
  ariaPressed,
  gradientId,
}) => {
  const hasIcon = icon != null || iconInactive != null;
  const hasInactivePair = icon != null && iconInactive != null;
  const isRainbow = effect === 'rainbow';
  const showLabel = children != null && children !== false && children !== '';

  const content = (
    <>
      {isRainbow && <div className={styles.glow} aria-hidden="true" />}

      <div className={styles['border-wrapper']}>
        {isRainbow && <div className={styles['border-gradient']} aria-hidden="true" />}

        <div className={styles.inner}>
          {hasIcon && (
            <div
              className={[
                styles['icon-slot'],
                hasInactivePair ? styles['icon-slot-pair'] : styles['icon-slot-single'],
              ].join(' ')}
              aria-hidden="true"
            >
              {icon != null && (
                <span className={`${styles['icon-face']} ${styles['icon-active']}`}>
                  {icon}
                </span>
              )}
              {iconInactive != null && (
                <span className={`${styles['icon-face']} ${styles['icon-inactive']}`}>
                  {iconInactive}
                </span>
              )}
            </div>
          )}

          {showLabel && <span className={styles.label}>{children}</span>}
        </div>
      </div>
    </>
  );

  const defs =
    isRainbow && gradientId ? (
      <svg className={styles['svg-defs']} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5E42F8" />
            <stop offset="50%" stopColor="#B656CB" />
            <stop offset="100%" stopColor="#F15565" />
          </linearGradient>
        </defs>
      </svg>
    ) : null;

  if (onClick) {
    return (
      <>
        {defs}
        <button
          type="button"
          className={rootClass}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-pressed={ariaPressed}
        >
          {content}
        </button>
      </>
    );
  }

  return (
    <>
      {defs}
      <span className={rootClass} aria-label={ariaLabel}>
        {content}
      </span>
    </>
  );
};
