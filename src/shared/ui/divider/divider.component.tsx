import React from 'react';
import { DividerProps } from './interfaces/divider-props.interface';
import { DividerTemplate } from './divider.html';
import styles from './divider.module.css';

export type { DividerProps } from './interfaces/divider-props.interface';

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  const dividerClass = [styles.divider, styles[orientation], className]
    .filter(Boolean)
    .join(' ');

  return <DividerTemplate orientation={orientation} dividerClass={dividerClass} />;
};
