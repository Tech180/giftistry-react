import React from 'react';
import { ChipProps } from './interfaces/chip-props.interface';
import { ChipTemplate } from './chip.html';
import styles from './chip.module.css';

export type { ChipProps } from './interfaces/chip-props.interface';

export const Chip: React.FC<ChipProps> = ({
  label,
  isActive = false,
  onClick,
  className = '',
}) => {
  const chipClass = [styles.chip, isActive ? styles.active : '', className]
    .filter(Boolean)
    .join(' ');

  return <ChipTemplate label={label} isActive={isActive} onClick={onClick} chipClass={chipClass} />;
};
