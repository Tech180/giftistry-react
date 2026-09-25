import React from 'react';
import type { AccountTemplateProps } from './interfaces/template-props.interface';
import styles from './account.module.css';

export const AccountTemplate: React.FC<AccountTemplateProps> = ({ children }) => (
  <div className={styles.account}>{children}</div>
);
