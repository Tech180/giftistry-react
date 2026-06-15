import React from 'react';
import { ButtonProps } from 'shared/interfaces/button-props.interface';
import { ButtonTemplate } from './button.html';
import styles from './button.module.css';

export type { ButtonProps } from 'shared/interfaces/button-props.interface';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    isLoading ? styles.loading : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <ButtonTemplate
      buttonClass={buttonClass}
      variant={variant}
      size={size}
      isLoading={isLoading}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      className={className}
      {...props}
    >
      {children}
    </ButtonTemplate>
  );
};
