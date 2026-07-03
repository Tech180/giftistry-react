import React from 'react';
import { AppShellProps } from './interfaces/app-shell-props.interface';
import styles from './app-shell.module.css';

export const AppShellTemplate: React.FC<AppShellProps> = ({
  navigation,
  banner,
  children,
  isProfilePage = false,
  hasBanner = false,
}) => (
  <div className={styles.container}>
    {navigation}
    {banner}
    <main
      className={[
        isProfilePage ? styles.profileMain : styles.main,
        hasBanner ? styles.hasBanner : '',
        'animate-fade-in',
      ].filter(Boolean).join(' ')}
    >
      {children}
    </main>
  </div>
);
