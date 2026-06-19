import React, { forwardRef } from 'react';
import { InputTemplateProps } from 'shared/interfaces/input-template-props.interface';
import styles from './input.module.css';

export const InputTemplate = forwardRef<HTMLInputElement, InputTemplateProps>(({
  label,
  error,
  leftIcon,
  leftIconClickable,
  className = '',
  type = 'text',
  inputId,
  inputClass,
  id,
  ...props
}, ref) => {
  const iconClass = [
    styles.icon,
    leftIconClickable ? styles.clickableIcon : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.wrapper}>
        {leftIcon && <span className={iconClass}>{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClass}
          {...props}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

InputTemplate.displayName = 'InputTemplate';
