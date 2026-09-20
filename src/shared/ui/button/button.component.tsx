import React, { useId } from 'react';
import { ButtonProps } from './interfaces/button-props.interface';
import { ButtonTemplate } from './button.html';
import { buildClasses } from './utils/build-classes.util';

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
  disabled,
  ...props
}) => {
  const rawId = useId().replace(/:/g, '');
  const isRainbow = effect === 'rainbow';
  const gradientId = isRainbow
    ? (gradientIdProp ?? `button-gradient-${rawId}`)
    : undefined;
  const classes = buildClasses({
    variant,
    size,
    effect,
    iconOnly,
    className,
  });

  return (
    <ButtonTemplate
      buttonClass = {
        classes.buttonClass
      }
      innerClass = {
        classes.innerClass
      }
      showRainbow = {
        classes.showRainbow
      }
      showDefs = {
        Boolean(isRainbow && gradientId)
      }
      showSpinner = {
        isLoading
      }
      showLeftIcon = {
        !isLoading && Boolean(leftIcon)
      }
      showRightIcon = {
        !isLoading && Boolean(rightIcon)
      }
      leftIcon = {
        leftIcon
      }
      rightIcon = {
        rightIcon
      }
      gradientId = {
        gradientId
      }
      disabled = {
        disabled || isLoading
      }
      {...props}
    >
      {children}
    </ButtonTemplate>
  );
};
