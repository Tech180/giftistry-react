import React from 'react';
import { TopBarProps } from './interfaces/top-bar-props.interface';
import { TopBarTemplate } from './top-bar.html';
import styles from './top-bar.module.css';

export type { TopBarProps } from './interfaces/top-bar-props.interface';

export const TopBar: React.FC<TopBarProps> = ({
  left,
  center,
  right,
  className = '',
}) => {
  const containerClass = [styles['top-bar'], className].filter(Boolean).join(' ');

  return (
    <TopBarTemplate
      left={left}
      center={center}
      right={right}
      containerClass={containerClass}
    />
  );
};
