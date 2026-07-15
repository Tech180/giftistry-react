import React from 'react';
import { UserAvatarBoxProps } from './interfaces/user-avatar-box-props.interface';
import styles from './user-avatar-box.module.css';

export const UserAvatarBox: React.FC<UserAvatarBoxProps> = ({
  title,
  ariaLabel,
  variant = 'sharing',
  children,
}) => (
  <div
    className={`${styles['user-avatar-box']} ${styles[`user-avatar-box-${variant}`]}`}
    aria-label={ariaLabel}
  >
    <span className={styles['user-avatar-box-title']}>{title}</span>
    <div className={styles['user-avatar-box-body']}>{children}</div>
  </div>
);
