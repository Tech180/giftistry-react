import React from 'react';
import { ChangePasswordForm } from 'features/auth/components/change-password-form/change-password-form.component';
import styles from './change-password.module.css';

export const ChangePasswordTemplate: React.FC = () => (
  <div className={styles.container}>
    <ChangePasswordForm />
  </div>
);
