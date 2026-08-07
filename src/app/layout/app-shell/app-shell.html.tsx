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
  isAuthPage = false,
}) => (
  <div className={styles.container}>
    {!isAuthPage && navigation}
    {!isAuthPage && banner}
    <EnterPanel
      as="main"
      animation="fade"
      className={[
        isSettingsPage ? styles['settings-main'] : styles.main,
        isFullWidth ? styles['full-width'] : '',
        hasBanner && !isAuthPage ? styles['has-banner'] : '',
        isAuthPage ? styles['auth-main'] : '',
      ].filter(Boolean).join(' ')}
    >
      {isSettingsPage ? (
        children
      ) : (
        <div className={styles.mainInner}>{children}</div>
      )}
    </EnterPanel>
  </div>
);
