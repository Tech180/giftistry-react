import React from 'react';
import { Switch } from 'shared/ui';
import type { Props } from './interfaces/props.interface';
import styles from './filter-switch-row.module.css';

export const FilterSwitchRow: React.FC<Props> = ({ id, label, checked, onChange }) => {
  return (
    <div
      className = {
        styles['filter-switch-row']
      }
    >
      <span
        id = {
          `${id}-label`
        }
      >
        {label}
      </span>
      <Switch
        id = {
          id
        }
        checked = {
          checked
        }
        onChange = {
          onChange
        }
        size = {
          'sm'
        }
        aria-label = {
          label
        }
      />
    </div>
  );
};
