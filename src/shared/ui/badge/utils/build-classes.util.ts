import type { BadgeEffect } from '../interfaces/badge-effect.type';
import type { BadgeSize } from '../interfaces/badge-size.type';
import type { BadgeTone } from '../interfaces/badge-tone.type';
import styles from '../badge.module.css';

export const buildClasses = ({
  size,
  effect,
  tone,
  active,
  isInteractive,
  hasInactivePair,
  className,
}: {
  size: BadgeSize;
  effect: BadgeEffect;
  tone: BadgeTone;
  active: boolean;
  isInteractive: boolean;
  hasInactivePair: boolean;
  className: string;
}) => {
  const isRainbow = effect === 'rainbow';
  const isSuccess = tone === 'success';
  const isCompact = size === 'compact';

  const rootClass = [
    styles.badge,
    styles[`badge--size-${size}`],
    tone !== 'default' ? styles[`badge--tone-${tone}`] : '',
    active ? styles['badge--active'] : '',
    isRainbow ? styles['badge--effect-rainbow'] : '',
    isInteractive ? styles['badge--interactive'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const borderWrapperClass = [
    styles['badge__border-wrapper'],
    size === 'sm' ? styles['badge__border-wrapper--size-sm'] : '',
    isCompact ? styles['badge__border-wrapper--size-compact'] : '',
    isRainbow ? styles['badge__border-wrapper--rainbow'] : '',
    isRainbow && !active ? styles['badge__border-wrapper--rainbow-inactive'] : '',
    isRainbow && !active && isInteractive
      ? styles['badge__border-wrapper--interactive']
      : '',
    isSuccess ? styles['badge__border-wrapper--tone-success'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const borderGradientClass = [
    styles['badge__border-gradient'],
    isRainbow ? styles['badge__border-gradient--rainbow'] : '',
    isRainbow && active ? styles['badge__border-gradient--visible'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const innerClass = [
    styles['badge__inner'],
    size === 'sm' ? styles['badge__inner--size-sm'] : '',
    size === 'md' ? styles['badge__inner--size-md'] : '',
    isCompact ? styles['badge__inner--size-compact'] : '',
    isRainbow ? styles['badge__inner--rainbow'] : '',
    isRainbow && active ? styles['badge__inner--rainbow-active'] : '',
    isRainbow && !active ? styles['badge__inner--rainbow-inactive'] : '',
    !isRainbow && active ? styles['badge__inner--active'] : '',
    isInteractive && !isRainbow ? styles['badge__inner--interactive'] : '',
    isInteractive && isRainbow && !active ? styles['badge__inner--interactive'] : '',
    isSuccess ? styles['badge__inner--tone-success'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const iconSlotClass = [
    styles['badge__icon-slot'],
    isCompact ? styles['badge__icon-slot--compact'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const activeIconClass = [
    styles['badge__icon-face'],
    isCompact ? styles['badge__icon-face--compact'] : '',
    !hasInactivePair ? styles['badge__icon-face--single'] : '',
    hasInactivePair
      ? active
        ? styles['badge__icon-face--shown']
        : styles['badge__icon-face--hidden']
      : '',
    isRainbow && active ? styles['badge__icon-face--rainbow-active'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inactiveIconClass = [
    styles['badge__icon-face'],
    isCompact ? styles['badge__icon-face--compact'] : '',
    !hasInactivePair ? styles['badge__icon-face--single'] : '',
    hasInactivePair
      ? active
        ? styles['badge__icon-face--hidden']
        : styles['badge__icon-face--shown']
      : '',
    styles['badge__icon-face--inactive-tone'],
    isRainbow && active ? styles['badge__icon-face--rainbow-active'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const labelClass = [
    styles['badge__label'],
    isRainbow && active ? styles['badge__label--rainbow-active'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    rootClass,
    borderWrapperClass,
    borderGradientClass,
    showBorderGradient: isRainbow,
    innerClass,
    iconSlotClass,
    activeIconClass,
    inactiveIconClass,
    labelClass,
  };
};
