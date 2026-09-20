import React from 'react';
import { IconButtonProps } from './interfaces/icon-button-props.interface';
import { IconButtonTemplate } from './icon-button.html';
import styles from './icon-button.module.css';

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}) => {
  const buttonClass = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <IconButtonTemplate
      icon = {
        icon
      }
      ariaLabel = {
        ariaLabel
      }
      variant = {
        variant
      }
      size = {
        size
      }
      onClick = {
        onClick
      }
      disabled = {
        disabled
      }
      buttonClass = {
        buttonClass
      }
    />
  );
};
