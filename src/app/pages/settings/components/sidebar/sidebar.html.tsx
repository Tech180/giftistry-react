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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Sidebar as SidebarRail, SidebarItem } from 'shared/ui';
import { TOUR_TARGETS } from 'features/tour';
import type { SidebarTemplateProps } from './interfaces/sidebar-template-props.interface';
import styles from './sidebar.module.css';

export const SidebarTemplate: React.FC<SidebarTemplateProps> = ({
  isAdmin,
  isOwner,
  activePath,
  onNavigate,
  isCollapsed,
  panelId,
  onToggleCollapsed,
}) => {
  const rootClass = [
    styles['sidebar'],
    isCollapsed ? styles['sidebar--collapsed'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const panelClass = [
    styles['sidebar__panel'],
    isCollapsed ? styles['sidebar__panel--collapsed'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const toggleClass = [
    styles['sidebar__edge-toggle'],
    isCollapsed ? styles['sidebar__edge-toggle--collapsed'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={rootClass}>
      <div id={panelId} className={panelClass} inert={isCollapsed || undefined}>
        <SidebarRail className={styles['sidebar__nav']}>
          <div className={styles['sidebar__group-label']}>Account</div>
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
            dataTour={TOUR_TARGETS.settingsNotifications}
          />
          <SidebarItem
            icon={<Palette size={15} />}
            label="Theming"
            isActive={activePath === '/settings/theming'}
            onClick={() => onNavigate('/settings/theming')}
          />

          {isAdmin ? (
            <>
              <div
                className={`${styles['sidebar__group-label']} ${styles['sidebar__group-label--system']}`}
              >
                Administration
              </div>
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
              {isOwner ? (
                <SidebarItem
                  icon={<Server size={15} />}
                  label="Server"
                  isActive={activePath === '/settings/admin/server'}
                  onClick={() => onNavigate('/settings/admin/server')}
                />
              ) : null}
            </>
          ) : null}
        </SidebarRail>
      </div>

      <button
        type="button"
        className={toggleClass}
        aria-expanded={!isCollapsed}
        aria-controls={panelId}
        aria-label={isCollapsed ? 'Open settings navigation' : 'Close settings navigation'}
        onClick={onToggleCollapsed}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
};
