import React from 'react';
import { ButtonTemplateProps } from './interfaces/button-template-props.interface';
import styles from './button.module.css';

export const ButtonTemplate: React.FC<ButtonTemplateProps> = ({
  children,
  buttonClass,
  innerClass,
  showRainbow,
  showDefs,
  showSpinner,
  showLeftIcon,
  showRightIcon,
  leftIcon,
  rightIcon,
  gradientId,
  disabled,
  ...props
}) => {
  const body = (
    <>
      {showSpinner && <span className={styles['button__spinner']} />}
      {showLeftIcon && <span className={styles['button__icon']}>{leftIcon}</span>}
      <span className={styles['button__content']}>{children}</span>
      {showRightIcon && <span className={styles['button__icon']}>{rightIcon}</span>}
    </>
  );

  const defs = showDefs ? (
    <svg className={styles['button__svg-defs']} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="50%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--error)" />
        </linearGradient>
      </defs>
    </svg>
  ) : null;

  return (
    <>
      {defs}
      <button className={buttonClass} disabled={disabled} {...props}>
        {showRainbow ? (
          <div className={styles['button__border-wrapper']}>
            <div className={styles['button__border-gradient']} aria-hidden="true" />
            <div className={innerClass}>{body}</div>
          </div>
        ) : (
          body
        )}
      </button>
    </>
  );
};
