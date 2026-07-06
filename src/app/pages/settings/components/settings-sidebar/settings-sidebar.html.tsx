import React from 'react';
import { User, Lock, Bell, Palette, Server } from 'lucide-react';
import { Sidebar, SidebarItem } from 'shared/ui';
import { SettingsSidebarTemplateProps } from './interfaces/settings-sidebar-template-props.interface';
import styles from './settings-sidebar.module.css';

export const SettingsSidebarTemplate: React.FC<SettingsSidebarTemplateProps> = ({
  isAdmin,
  activePath,
  onNavigate,
}) => {
  return (
    <aside className={styles.wrapper}>
      <Sidebar className={styles.sidebar}>
        <div className={styles['nav-group-label']}>Account</div>
        <SidebarItem
          icon={<User size={15} />}
          label="Account"
          isActive={activePath === '/settings/account'}
          onClick={() => onNavigate('/settings/account')}
        />
        <SidebarItem
          icon={<Lock size={15} />}
          label="Security"
          isActive={activePath === '/settings/security'}
          onClick={() => onNavigate('/settings/security')}
        />
        <SidebarItem
          icon={<Bell size={15} />}
          label="Notifications"
          isActive={activePath === '/settings/notifications'}
          onClick={() => onNavigate('/settings/notifications')}
        />
        <SidebarItem
          icon={<Palette size={15} />}
          label="Theming"
          isActive={activePath === '/settings/theming'}
          onClick={() => onNavigate('/settings/theming')}
        />

        {isAdmin && (
          <>
            <div className={`${styles['nav-group-label']} ${styles['system-group']}`}>System</div>
            <SidebarItem
              icon={<Server size={15} />}
              label="Server Configuration"
              isActive={activePath === '/settings/server'}
              onClick={() => onNavigate('/settings/server')}
            />
          </>
        )}
      </Sidebar>
    </aside>
  );
};
