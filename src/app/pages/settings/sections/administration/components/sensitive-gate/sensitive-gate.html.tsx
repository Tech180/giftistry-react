import React from 'react';
import { Button } from 'shared/ui';
import { SensitiveGateTemplateProps } from './interfaces/sensitive-gate-template-props.interface';
import styles from './sensitive-gate.module.css';

export const SensitiveGateTemplate: React.FC<SensitiveGateTemplateProps> = ({
  title,
  description,
  icon: Icon,
  unlockLabel,
  isLocked,
  onUnlock,
  children,
}) => (
  <div className={styles['sensitive-container']}>
    {isLocked && (
      <div className={styles['sensitive-overlay']}>
        <div className={styles['sensitive-card']}>
          <Icon className={styles['sensitive-icon']} aria-hidden />
          <h3 className={styles['sensitive-title']}>{title}</h3>
          <p className={styles['sensitive-desc']}>{description}</p>
          <Button variant="primary" onClick={onUnlock}>
            {unlockLabel}
          </Button>
        </div>
      </div>
    )}
    <div className={`${styles['sensitive-content']} ${isLocked ? styles['sensitive-content-locked'] : ''}`}>
      {children}
    </div>
  </div>
);
