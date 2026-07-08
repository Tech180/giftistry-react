import React from 'react';
import { SwitchTemplateProps } from './interfaces/switch-template-props.interface';
import styles from './switch.module.css';

export const SwitchTemplate: React.FC<SwitchTemplateProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  className = '',
  size = 'default',
  ariaLabel,
}) => {
  const switchClass = [
    styles.switch,
    size === 'sm' ? styles.sm : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={switchClass}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      <span className={styles.slider} aria-hidden="true" />
    </label>
  );
};
