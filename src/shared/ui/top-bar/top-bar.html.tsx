import React from 'react';
import { TopBarTemplateProps } from './interfaces/top-bar-template-props.interface';
import styles from './top-bar.module.css';

export const TopBarTemplate: React.FC<TopBarTemplateProps> = ({
  left,
  center,
  right,
  containerClass,
}) => {
  return (
    <header className={containerClass}>
      <div className={styles.left}>{left}</div>
      <div className={styles.center}>{center}</div>
      <div className={styles.right}>{right}</div>
    </header>
  );
};
