import React from 'react';
import type { Props } from './interfaces/props.interface';
import { PriorityDisplayTemplate } from './priority-display.html';
import styles from './priority-display.module.css';

export const PriorityDisplay: React.FC<Props> = ({
  priority,
  variant = 'badge',
  showHint = false,
  className,
}) => {
  const rootClassName = [
    styles['priority-display'],
    styles[`priority-display--${variant}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  const labelClassName = [
    styles['priority-display__label'],
    styles[`priority-display__label--${variant}`],
  ]
    .filter(Boolean)
    .join(' ');
  const valueClassName = [
    styles['priority-display__value'],
    styles[`priority-display__value--${variant}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <PriorityDisplayTemplate
      priority = {
        priority
      }
      showHint = {
        showHint
      }
      rootClassName = {
        rootClassName
      }
      labelClassName = {
        labelClassName
      }
      valueClassName = {
        valueClassName
      }
      hintClassName = {
        styles['priority-display__hint']
      }
      ariaLabel = {
        `Priority ${priority}`
      }
    />
  );
};
