import React from 'react';
import { IconButtonTemplateProps } from './interfaces/icon-button-template-props.interface';
import styles from './icon-button.module.css';

export const IconButtonTemplate: React.FC<IconButtonTemplateProps> = ({
  icon,
  ariaLabel,
  onClick,
  disabled,
  buttonClass,
}) => {
  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span className={styles.icon}>{icon}</span>
    </button>
  );
};
