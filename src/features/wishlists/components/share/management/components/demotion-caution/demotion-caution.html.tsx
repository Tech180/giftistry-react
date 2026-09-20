import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button, UserAvatar } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './demotion-caution.module.css';

export const DemotionCautionTemplate: React.FC<TemplateProps> = ({
  title,
  description,
  proceedPrompt,
  displayName,
  username,
  avatar,
  error,
  isConfirming,
  onConfirm,
  onCancel,
  initials,
}) => {
  return (
    <div className={styles.caution} role="region" aria-labelledby="role-demotion-caution-title">
      <div className={styles['caution-body']}>
        <div className={styles['caution-header']}>
          <ShieldAlert
            className = {
              styles['caution-icon']
            }
            aria-hidden
          />
          <h3 id="role-demotion-caution-title" className={styles['caution-title']}>
            {title}
          </h3>
        </div>
        {displayName && (
          <div className={styles['caution-person']}>
            <UserAvatar
              avatar = {
                avatar
              }
              alt = {
                displayName
              }
              initials = {
                initials
              }
              className = {
                styles['caution-avatar']
              }
              imageClassName = {
                styles['caution-avatar-img']
              }
              initialsClassName = {
                styles['caution-avatar-initials']
              }
            />
            <div className={styles['caution-person-text']}>
              <p className={styles['caution-subject']}>{displayName}</p>
              {username && <p className={styles['caution-username']}>@{username}</p>}
            </div>
          </div>
        )}
        <p className={styles['caution-desc']}>{description}</p>
        {error && <p className={styles['error-text']}>{error}</p>}
      </div>
      <div className={styles['caution-footer']}>
        <p className={styles['caution-proceed-prompt']}>{proceedPrompt}</p>
        <div className={styles['caution-actions']}>
          <Button
            type = {
              'button'
            }
            variant = {
              'secondary'
            }
            size = {
              'sm'
            }
            onClick = {
              onCancel
            }
            disabled = {
              isConfirming
            }
          >
            Cancel
          </Button>
          <Button
            type = {
              'button'
            }
            variant = {
              'primary'
            }
            size = {
              'sm'
            }
            onClick = {
              onConfirm
            }
            disabled = {
              isConfirming
            }
            isLoading = {
              isConfirming
            }
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};
