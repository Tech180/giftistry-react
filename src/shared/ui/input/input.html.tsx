import React, { forwardRef } from 'react';
import { InputTemplateProps } from './interfaces/input-template-props.interface';
import styles from './input.module.css';

export const InputTemplate = forwardRef<HTMLInputElement, InputTemplateProps>(({
  label,
  error,
  leftIcon,
  leftIconClickable,
  rightIcon,
  rightIconClickable,
  className = '',
  type = 'text',
  inputId,
  inputClass,
  wrapperClass = '',
  id,
  ...props
}, ref) => {
  const leftIconClass = [
    styles.icon,
    leftIconClickable ? styles['clickable-icon'] : '',
  ].filter(Boolean).join(' ');

  const rightIconClass = [
    styles.icon,
    styles['icon-right'],
    rightIconClickable ? styles['clickable-icon'] : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={wrapperClass}>
        {leftIcon && <span className={leftIconClass}>{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClass}
          {...props}
        />
        {rightIcon && <span className={rightIconClass}>{rightIcon}</span>}
      </div>
      {error && <span className={styles['error-text']}>{error}</span>}
    </div>
  );
});

InputTemplate.displayName = 'InputTemplate';
