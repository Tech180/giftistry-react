import React from 'react';
import styles from './loading.module.css';

export const LoadingTemplate: React.FC = () => {
  return (
    <div
      className = {
        styles['loading']
      }
    >
      <div
        className = {
          styles['loading__spinner']
        }
      />
    </div>
  );
};
