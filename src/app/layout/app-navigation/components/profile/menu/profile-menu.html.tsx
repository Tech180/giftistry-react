import React from 'react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import type { ProfileMenuTemplateProps } from './interfaces/profile-menu-template-props.interface';
import styles from './profile-menu.module.css';

export const ProfileMenuTemplate: React.FC<ProfileMenuTemplateProps> = ({
  user,
  menuClassName,
  actions,
}) => (
  <EnterPanel animation="dropdown" className={menuClassName}>
    <div className={styles['user-info']}>
      <div className={styles['user-name']}>
        {user.FirstName} {user.LastName}
      </div>
      <div className={styles['user-email']}>@{user.Username}</div>
    </div>

    <div className={styles['menu-divider']} />

    {actions.map((action) => {
      const Icon = action.icon;
      return (
        <button
          key={action.id}
          type="button"
          className={`${styles['menu-item']}${action.danger ? ` ${styles['danger-item']}` : ''}`}
          onClick={action.onSelect}
        >
          <Icon size={14} className={styles['item-icon']} />
          {action.label}
        </button>
      );
    })}
  </EnterPanel>
);
