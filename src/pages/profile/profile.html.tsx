import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Shield, Bell, Palette, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastInfo } from './profile.component';
import styles from './profile.module.css';

interface ProfileTemplateProps {
  routes: React.ReactNode;
  toasts: ToastInfo[];
}

export const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ routes, toasts }) => {
  return (
    <div className={styles.appBody}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <div className={styles.navSectionTitle}>Account</div>
          
          <NavLink
            to="/profile/settings"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <User className={styles.navIcon} />
            Profile Settings
          </NavLink>

          <NavLink
            to="/profile/security"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Shield className={styles.navIcon} />
            Password & Security
          </NavLink>

          <NavLink
            to="/profile/notifications"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Bell className={styles.navIcon} />
            Notifications
          </NavLink>

          <NavLink
            to="/profile/theming"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Palette className={styles.navIcon} />
            Theming
          </NavLink>
        </nav>
      </aside>

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
