import React from 'react';
import { ChipTemplateProps } from './interfaces/chip-template-props.interface';

export const ChipTemplate: React.FC<ChipTemplateProps> = ({
  label,
  onClick,
  chipClass,
}) => {
  return (
    <button type="button" className={chipClass} onClick={onClick}>
      {label}
    </button>
  );
};
