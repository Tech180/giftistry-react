import React from 'react';
import { SwitchTemplateProps } from './interfaces/switch-template-props.interface';
import styles from './switch.module.css';

export const SwitchTemplate: React.FC<SwitchTemplateProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  className = '',
  ariaLabel,
}) => {
  return (
    <label className={`${styles.switch} ${className}`.trim()}>
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
