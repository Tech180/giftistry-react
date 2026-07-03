import React from 'react';
import { User, Lock, Bell, Palette, Server } from 'lucide-react';
import { Sidebar, SidebarItem } from 'shared/ui';
import { ProfileSidebarTemplateProps } from './interfaces/profile-sidebar-template-props.interface';
import styles from './profile-sidebar.module.css';

export const ProfileSidebarTemplate: React.FC<ProfileSidebarTemplateProps> = ({
  isAdmin,
  activePath,
  onNavigate,
}) => {
  return (
    <aside className={styles.wrapper}>
      <Sidebar className={styles.sidebar}>
        <div className={styles.navGroupLabel}>Account</div>
        <SidebarItem
          icon={<User size={15} />}
          label="Profile"
          isActive={activePath === '/profile/settings'}
          onClick={() => onNavigate('/profile/settings')}
        />
        <SidebarItem
          icon={<Lock size={15} />}
          label="Security"
          isActive={activePath === '/profile/security'}
          onClick={() => onNavigate('/profile/security')}
        />
        <SidebarItem
          icon={<Bell size={15} />}
          label="Notifications"
          isActive={activePath === '/profile/notifications'}
          onClick={() => onNavigate('/profile/notifications')}
        />
        <SidebarItem
          icon={<Palette size={15} />}
          label="Theming"
          isActive={activePath === '/profile/theming'}
          onClick={() => onNavigate('/profile/theming')}
        />

        {isAdmin && (
          <>
            <div className={`${styles.navGroupLabel} ${styles.systemGroup}`}>System</div>
            <SidebarItem
              icon={<Server size={15} />}
              label="Server Configuration"
              isActive={activePath === '/profile/server'}
              onClick={() => onNavigate('/profile/server')}
            />
          </>
        )}
      </Sidebar>
    </aside>
  );
};
