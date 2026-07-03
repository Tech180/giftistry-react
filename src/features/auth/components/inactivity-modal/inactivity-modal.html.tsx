import React from 'react';
import { InactivityModalTemplateProps } from './interfaces/inactivity-modal-template-props.interface';
import { Button } from 'shared/ui';
import styles from './inactivity-modal.module.css';

export const InactivityModalTemplate: React.FC<InactivityModalTemplateProps> = ({
  countdown,
  onExtendSession,
  onSignOut,
}) => (
  <div className={styles.overlay}>
    <div className={styles.dialog}>
      <h3 className={styles.title}>Inactivity Warning</h3>
      <p className={styles.message}>
        You have been inactive for a while. For your security, you will be automatically logged out in{' '}
        <strong className={styles.countdown}>{countdown}</strong> seconds.
      </p>
      <div className={styles.actions}>
        <Button variant="primary" onClick={onExtendSession}>
          Keep Me Logged In
        </Button>
        <Button variant="secondary" onClick={onSignOut}>
          Sign Out Now
        </Button>
      </div>
    </div>
  </div>
);
