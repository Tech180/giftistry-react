import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './header.module.css';

export const HeaderTemplate: React.FC<TemplateProps> = ({
  totalFriendsCount,
  pendingCount,
}) => (
  <div className={styles['header']}>
    <div className={styles['header__left']}>
      <h1 className={styles['header__title']}>Friends & Connections</h1>
      <p className={styles['header__subtitle']}>
        Manage your network, view upcoming birthdays, and track wishlists.
      </p>
    </div>
    <div className={styles['header__stats']}>
      <div className={styles['header__stat-card']}>
        <span className={styles['header__stat-label']}>Total Friends</span>
        <span className={styles['header__stat-val']}>{totalFriendsCount}</span>
      </div>
      <div className={styles['header__stat-card']}>
        <span className={styles['header__stat-label']}>Pending</span>
        <span className={styles['header__stat-val']}>{pendingCount}</span>
      </div>
    </div>
  </div>
);
