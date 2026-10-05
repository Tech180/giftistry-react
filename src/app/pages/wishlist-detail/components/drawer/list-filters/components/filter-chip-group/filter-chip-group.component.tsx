import React from 'react';
import { Chip } from 'shared/ui';
import type { Props } from './interfaces/props.interface';
import styles from './filter-chip-group.module.css';

export function FilterChipGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: Props<T>) {
  return (
    <div
      className = {
        styles['filter-chip-group']
      }
      role = {
        'group'
      }
      aria-label = {
        ariaLabel
      }
    >
      {options.map((option) => (
        <Chip
          key = {
            option.id
          }
          className = {
            styles['filter-chip-group__chip']
          }
          label = {
            option.label
          }
          isActive = {
            value === option.id
          }
          onClick = {
            () => onChange(option.id)
          }
        />
      ))}
    </div>
  );
}
