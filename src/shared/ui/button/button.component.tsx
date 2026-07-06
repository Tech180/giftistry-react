import React from 'react';
import { ButtonProps } from './interfaces/button-props.interface';
import { ButtonTemplate } from './button.html';
import styles from './button.module.css';

export type { ButtonProps } from './interfaces/button-props.interface';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconOnly = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly ? styles['icon-only'] : '',
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
