import React from 'react';
import { EnterPanel } from 'shared/ui';
import { Check, AlertCircle } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './profile-card.module.css';

export const ProfileCardTemplate: React.FC<TemplateProps> = ({
  errorMsg,
  successMsg,
  avatarEditor,
  profileForm,
  aiPreferences,
  dangerZone,
}) => {
  return (
    <EnterPanel animation="fade" className={styles.container}>
      <div className={styles['page-header']}>
        <h2 className={styles['page-title']}>Account Settings</h2>
        <p className={styles['page-subtitle']}>Manage your personal information and public presence.</p>
      </div>

      {errorMsg && (
        <EnterPanel animation="slide-up" className={`${styles.alert} ${styles['alert-error']}`}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </EnterPanel>
      )}

      {successMsg && (
        <EnterPanel animation="slide-up" className={`${styles.alert} ${styles['alert-success']}`}>
          <Check size={16} />
          <span>{successMsg}</span>
        </EnterPanel>
      )}

      <div className={styles['flex-layout']}>
        {avatarEditor}
        {profileForm}
      </div>

      {aiPreferences}
      {dangerZone}
    </EnterPanel>
  );
};
