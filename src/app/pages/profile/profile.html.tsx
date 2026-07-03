import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ProfileTemplateProps } from './interfaces/profile-template-props.interface';
import { ProfileSidebar } from './components/profile-sidebar/profile-sidebar.component';
import styles from './profile.module.css';

export const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ routes, toasts, isAdmin }) => {
  return (
    <div className={styles.appBody}>
      {/* Sidebar Navigation */}
      <ProfileSidebar isAdmin={isAdmin} />

      {/* Main Settings Panel Content */}
      <main className={styles.mainWrapper}>
        {routes}
      </main>

      {/* Shared Toast Notifications */}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <div key={toast.id} className={`${styles.toast} ${styles.toastShow}`}>
            {toast.type === 'success' && <CheckCircle size={18} className={`${styles.toastIcon} ${styles.success}`} />}
            {toast.type === 'error' && <AlertCircle size={18} className={`${styles.toastIcon} ${styles.error}`} />}
            {toast.type === 'info' && <Info size={18} className={`${styles.toastIcon} ${styles.info}`} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
