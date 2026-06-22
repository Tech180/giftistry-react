import React from 'react';
import { ProfileCard } from 'features/auth';
import styles from './profile.module.css';

export const ProfileTemplate: React.FC = () => {
  return (
    <div className={styles.container}>
      <ProfileCard />
    </div>
  );
};
