import type { ButtonProps } from '../interfaces/button-props.interface';
import styles from '../button.module.css';

type BuildClassesInput = Pick<ButtonProps, 'variant' | 'size' | 'effect' | 'iconOnly' | 'className'>;

export const buildClasses = ({
  variant = 'primary',
  size = 'md',
  effect = 'none',
  iconOnly = false,
  className = '',
}: BuildClassesInput) => {
  const isRainbow = effect === 'rainbow';

  const buttonClass = [
    styles.button,
    styles[`button--variant-${variant}`],
    styles[`button--size-${size}`],
    iconOnly ? styles['button--icon-only'] : '',
    isRainbow ? styles['button--effect-rainbow'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const innerClass = [
    styles['button__inner'],
    variant === 'primary' ? styles['button__inner--variant-primary'] : '',
    variant === 'secondary' ? styles['button__inner--variant-secondary'] : '',
    size === 'sm' ? styles['button__inner--size-sm'] : '',
    size === 'md' ? styles['button__inner--size-md'] : '',
    size === 'lg' ? styles['button__inner--size-lg'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    buttonClass,
    innerClass,
    showRainbow: isRainbow,
  };
};
