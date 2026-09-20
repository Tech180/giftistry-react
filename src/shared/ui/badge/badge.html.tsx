import React from 'react';
import { BadgeTemplateProps } from './interfaces/badge-template-props.interface';
import styles from './badge.module.css';

export const BadgeTemplate: React.FC<BadgeTemplateProps> = ({
  children,
  rootClass,
  borderWrapperClass,
  borderGradientClass,
  showBorderGradient,
  innerClass,
  hasIcon,
  iconSlotClass,
  showActiveIcon,
  activeIconClass,
  showInactiveIcon,
  inactiveIconClass,
  showLabel,
  labelClass,
  showDefs,
  gradientId,
  icon,
  iconInactive,
  onClick,
  disabled = false,
  ariaLabel,
  ariaPressed,
}) => {
  const content = (
    <div className={borderWrapperClass}>
      {showBorderGradient && (
        <div className={borderGradientClass} aria-hidden="true" />
      )}

      <div className={innerClass}>
        {hasIcon && (
          <div className={iconSlotClass} aria-hidden="true">
            {showActiveIcon && <span className={activeIconClass}>{icon}</span>}
            {showInactiveIcon && (
              <span className={inactiveIconClass}>{iconInactive}</span>
            )}
          </div>
        )}

        {showLabel && <span className={labelClass}>{children}</span>}
      </div>
    </div>
  );

  const defs = showDefs ? (
    <svg className={styles['badge__svg-defs']} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="50%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--error)" />
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
