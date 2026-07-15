import React from 'react';
import { Switch } from 'shared/ui';
import { ClaimAnonymousToggleProps } from './interfaces/claim-anonymous-toggle-props.interface';
import styles from './claim-anonymous-toggle.module.css';

export const ClaimAnonymousToggle: React.FC<ClaimAnonymousToggleProps> = ({
  checked,
  onChange,
}) => (
  <div className={styles['anon-toggle-row']}>
    <span className={styles['anon-toggle-label']}>Anonymously</span>
    <Switch
      checked={checked}
      onChange={onChange}
      size="sm"
      aria-label="Claim anonymously"
    />
  </div>
);
