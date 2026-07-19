import React, { useId } from 'react';
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
  effect = 'none',
  gradientId: gradientIdProp,
  ...props
}) => {
  const rawId = useId().replace(/:/g, '');
  const gradientId =
    effect === 'rainbow' ? (gradientIdProp ?? `button-gradient-${rawId}`) : undefined;

  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly ? styles['icon-only'] : '',
    effect === 'rainbow' ? styles['effect-rainbow'] : '',
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
      effect={effect}
      gradientId={gradientId}
      {...props}
    >
      {children}
    </ButtonTemplate>
  );
};
