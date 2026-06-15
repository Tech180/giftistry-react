import React from 'react';
import { ButtonTemplateProps } from 'shared/interfaces/button-template-props.interface';
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
  ...props
}) => {
  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className={styles.spinner} />}
      {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      <span className={styles.content}>{children}</span>
      {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </button>
  );
};
