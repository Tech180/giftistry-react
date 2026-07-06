import React from 'react';
import { SwitchProps } from './interfaces/switch-props.interface';
import { SwitchTemplate } from './switch.html';

export type { SwitchProps } from './interfaces/switch-props.interface';

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  className = '',
  'aria-label': ariaLabel,
}) => {
  return (
    <SwitchTemplate
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      id={id}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
};
