import React from 'react';
import { Check } from 'lucide-react';
import styles from './success-step.module.css';

export const SuccessStepTemplate: React.FC = () => (
  <div className={`${styles['success-step']} ${styles['success-step--active']}`}>
    <div className={styles['success-step__icon-wrap']}>
      <Check size={32} className={styles['success-step__icon']} aria-hidden />
    </div>
    <h2 className={styles['success-step__heading']}>Installation Complete</h2>
    <p className={styles['success-step__text']}>
      Giftistry has been successfully configured and is ready to use. You can now log in with your
      administrator account.
    </p>
  </div>
);
