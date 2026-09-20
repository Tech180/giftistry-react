import React from 'react';
import type { Props } from './interfaces/props.interface';
import { UserAvatarBoxTemplate } from './user-avatar-box.html';
import styles from './user-avatar-box.module.css';

export const UserAvatarBox: React.FC<Props> = ({
  title,
  ariaLabel,
  variant = 'sharing',
  children,
}) => {
  const boxModifier =
    variant === 'claim'
      ? styles['user-avatar-box--claim']
      : variant === 'owner'
        ? styles['user-avatar-box--owner']
        : variant === 'suggestion'
          ? styles['user-avatar-box--suggestion']
          : undefined;
  const titleModifier =
    variant === 'claim'
      ? styles['user-avatar-box__title--claim']
      : variant === 'suggestion'
        ? styles['user-avatar-box__title--suggestion']
        : undefined;

  return (
    <UserAvatarBoxTemplate
      title = {
        title
      }
      ariaLabel = {
        ariaLabel
      }
      children = {
        children
      }
      rootClassName = {
        [styles['user-avatar-box'], boxModifier].filter(Boolean).join(' ')
      }
      titleClassName = {
        [styles['user-avatar-box__title'], titleModifier].filter(Boolean).join(' ')
      }
      bodyClassName = {
        styles['user-avatar-box__body']
      }
    />
  );
};
