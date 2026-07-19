import React, { forwardRef } from 'react';
import { InputProps } from './interfaces/input-props.interface';
import { InputTemplate } from './input.html';
import styles from './input.module.css';

export type { InputProps } from './interfaces/input-props.interface';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  leftIconClickable,
  rightIcon,
  rightIconClickable,
  variant = 'default',
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputClass = [
    styles.input,
    leftIcon ? styles['has-left-icon'] : '',
    rightIcon ? styles['has-right-icon'] : '',
  ].filter(Boolean).join(' ');

  const wrapperClass = [
    variant === 'inline' ? styles['wrapper-inline'] : styles.wrapper,
    error ? styles['wrapper-has-error'] : '',
  ].filter(Boolean).join(' ');

  return (
    <InputTemplate
      ref={ref}
      label={label}
      error={error}
      leftIcon={leftIcon}
      leftIconClickable={leftIconClickable}
      rightIcon={rightIcon}
      rightIconClickable={rightIconClickable}
      className={className}
      type={type}
      inputId={inputId}
      inputClass={inputClass}
      wrapperClass={wrapperClass}
      {...props}
    />
  );
});

Input.displayName = 'Input';
