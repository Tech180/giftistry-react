import React from 'react';
import { EnterPanel } from 'shared/ui';
import { AppShellProps } from './interfaces/app-shell-props.interface';
import styles from './app-shell.module.css';

export const AppShellTemplate: React.FC<AppShellProps> = ({
  navigation,
  banner,
  children,
  isSettingsPage = false,
  hasBanner = false,
  isFullWidth = false,
}) => (
  <div className={styles.container}>
    {navigation}
    {banner}
    <EnterPanel
      as="main"
      animation="fade"
      className={[
        isSettingsPage ? styles['settings-main'] : styles.main,
        isFullWidth ? styles['full-width'] : '',
        hasBanner ? styles['has-banner'] : '',
      ].filter(Boolean).join(' ')}
    >
      {children}
    </EnterPanel>
  </div>
);
