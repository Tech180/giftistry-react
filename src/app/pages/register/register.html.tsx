import React from 'react';
import { RegisterForm } from 'features/auth';
import styles from './register.module.css';

export const RegisterTemplate: React.FC = () => {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
};
