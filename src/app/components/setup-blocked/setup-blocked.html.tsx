import React from 'react';
import styles from './setup-blocked.module.css';

export const SetupBlockedTemplate: React.FC = () => {
  return (
    <div
      className = {
        styles['setup-blocked']
      }
    >
      <div
        className = {
          styles['setup-blocked__panel']
        }
      >
        <h1
          className = {
            styles['setup-blocked__title']
          }
        >
          Setup unavailable
        </h1>
        <p
          className = {
            styles['setup-blocked__message']
          }
        >
          This server has not been initialized and first-run setup is disabled. Contact your administrator.
        </p>
      </div>
    </div>
  );
};
