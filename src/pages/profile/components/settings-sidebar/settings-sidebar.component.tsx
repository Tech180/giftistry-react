import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Lock, Bell, Palette, Server } from 'lucide-react';
import styles from './settings-sidebar.module.css';

interface SettingsSidebarProps {
  isAdmin?: boolean;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ isAdmin = false }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.navGroupLabel}>Account</div>
      <nav className={styles.navSection}>
        <NavLink
          to="/profile/settings"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <User className={styles.navIcon} />
          Profile
        </NavLink>

        <NavLink
          to="/profile/security"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <Lock className={styles.navIcon} />
          Security
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

        {isAdmin && (
          <>
            <div className={styles.navGroupLabel} style={{ marginTop: '16px' }}>System</div>
            <NavLink
              to="/profile/server"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <Server className={styles.navIcon} />
              Server Configuration
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;
