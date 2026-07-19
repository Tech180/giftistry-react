import React from 'react';
import { ButtonTemplateProps } from './interfaces/button-template-props.interface';
import styles from './button.module.css';

export const ButtonTemplate: React.FC<ButtonTemplateProps> = ({
  children,
  isLoading,
  leftIcon,
  rightIcon,
  disabled,
  buttonClass,
  variant,
  size,
  className,
  effect = 'none',
  gradientId,
  ...props
}) => {
  const isRainbow = effect === 'rainbow';

  const content = (
    <>
      {isRainbow && <div className={styles.glow} aria-hidden="true" />}
      <div className={isRainbow ? styles['border-wrapper'] : undefined}>
        {isRainbow && <div className={styles['border-gradient']} aria-hidden="true" />}
        <div className={isRainbow ? styles.inner : undefined}>
          {isLoading && <span className={styles.spinner} />}
          {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          <span className={styles.content}>{children}</span>
          {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
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

  return (
    <>
      {defs}
      <button
        className={buttonClass}
        disabled={disabled || isLoading}
        {...props}
      >
        {isRainbow ? content : (
          <>
            {isLoading && <span className={styles.spinner} />}
            {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
            <span className={styles.content}>{children}</span>
            {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
          </>
        )}
      </button>
    </>
  );
};
