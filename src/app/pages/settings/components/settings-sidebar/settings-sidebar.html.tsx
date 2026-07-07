import React from 'react';
import {
  User,
  Lock,
  Bell,
  Palette,
  LayoutDashboard,
  Users,
  Flag,
  ScrollText,
  Server,
  Settings2,
} from 'lucide-react';
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
            <div className={`${styles['nav-group-label']} ${styles['system-group']}`}>Administration</div>
            <SidebarItem
              icon={<LayoutDashboard size={15} />}
              label="Overview"
              isActive={activePath === '/settings/admin' || activePath === '/settings/admin/'}
              onClick={() => onNavigate('/settings/admin')}
            />
            <SidebarItem
              icon={<Users size={15} />}
              label="Users"
              isActive={activePath.startsWith('/settings/admin/users')}
              onClick={() => onNavigate('/settings/admin/users')}
            />
            <SidebarItem
              icon={<Settings2 size={15} />}
              label="Site Policy"
              isActive={activePath === '/settings/admin/site'}
              onClick={() => onNavigate('/settings/admin/site')}
            />
            <SidebarItem
              icon={<Flag size={15} />}
              label="Moderation"
              isActive={activePath === '/settings/admin/moderation'}
              onClick={() => onNavigate('/settings/admin/moderation')}
            />
            <SidebarItem
              icon={<ScrollText size={15} />}
              label="Audit Log"
              isActive={activePath === '/settings/admin/audit'}
              onClick={() => onNavigate('/settings/admin/audit')}
            />
            <SidebarItem
              icon={<Server size={15} />}
              label="Server"
              isActive={activePath === '/settings/admin/server'}
              onClick={() => onNavigate('/settings/admin/server')}
            />
          </>
        )}
      </Sidebar>
    </aside>
  );
};
