import React, { useId } from 'react';
import { BadgeProps } from './interfaces/badge-props.interface';
import { BadgeTemplate } from './badge.html';
import { buildClasses } from './utils/build-classes.util';

export type { BadgeProps } from './interfaces/badge-props.interface';
export type { BadgeSize } from './interfaces/badge-size.type';
export type { BadgeEffect } from './interfaces/badge-effect.type';
export type { BadgeTone } from './interfaces/badge-tone.type';

export const Badge: React.FC<BadgeProps> = ({
  children,
  icon,
  iconInactive,
  active = false,
  effect = 'none',
  tone = 'default',
  size = 'md',
  onClick,
  disabled = false,
  ariaLabel,
  ariaPressed,
  className = '',
  gradientId: gradientIdProp,
}) => {
  const rawId = useId().replace(/:/g, '');
  const isRainbow = effect === 'rainbow';
  const gradientId = isRainbow
    ? (gradientIdProp ?? `badge-gradient-${rawId}`)
    : undefined;
  const isInteractive = Boolean(onClick);
  const hasIcon = icon != null || iconInactive != null;
  const hasInactivePair = icon != null && iconInactive != null;
  const showLabel = children != null && children !== false && children !== '';
  const classes = buildClasses({
    size,
    effect,
    tone,
    active,
    isInteractive,
    hasInactivePair,
    className,
  });

  return (
    <BadgeTemplate
      rootClass = {
        classes.rootClass
      }
      borderWrapperClass = {
        classes.borderWrapperClass
      }
      borderGradientClass = {
        classes.borderGradientClass
      }
      showBorderGradient = {
        classes.showBorderGradient
      }
      innerClass = {
        classes.innerClass
      }
      hasIcon = {
        hasIcon
      }
      iconSlotClass = {
        classes.iconSlotClass
      }
      showActiveIcon = {
        icon != null
      }
      activeIconClass = {
        classes.activeIconClass
      }
      showInactiveIcon = {
        iconInactive != null
      }
      inactiveIconClass = {
        classes.inactiveIconClass
      }
      showLabel = {
        showLabel
      }
      labelClass = {
        classes.labelClass
      }
      showDefs = {
        Boolean(isRainbow && gradientId)
      }
      gradientId = {
        gradientId
      }
      icon = {
        icon
      }
      iconInactive = {
        iconInactive
      }
      onClick = {
        onClick
      }
      disabled = {
        disabled
      }
      ariaLabel = {
        ariaLabel
      }
      ariaPressed = {
        ariaPressed
      }
    >
      {children}
    </BadgeTemplate>
  );
};
