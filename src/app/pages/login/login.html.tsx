import React from 'react';
import { LoginForm } from 'features/auth';
import styles from './login.module.css';

export const LoginTemplate: React.FC = () => {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
};
