import React from 'react';
import { Switch } from 'shared/ui';
import type { Props } from './interfaces/props.interface';
import styles from './filter-switch-row.module.css';

export const FilterSwitchRow: React.FC<Props> = ({
  id,
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <div
      className = {
        `${styles['filter-switch-row']}${description ? ` ${styles['filter-switch-row--with-description']}` : ''}`
      }
    >
      <div
        className = {
          styles['filter-switch-row__copy']
        }
      >
        <span
          id = {
            `${id}-label`
          }
          className = {
            styles['filter-switch-row__label']
          }
        >
          {label}
        </span>
        {description ? (
          <span
            className = {
              styles['filter-switch-row__description']
            }
          >
            {description}
          </span>
        ) : null}
      </div>
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
