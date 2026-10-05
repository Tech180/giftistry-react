import React from 'react';
import styles from './section-divider.module.css';

export const SectionDivider: React.FC = () => {
  return (
    <hr
      className = {
        styles['section-divider']
      }
    />
  );
};
