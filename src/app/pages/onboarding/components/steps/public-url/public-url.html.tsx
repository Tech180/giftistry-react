import React from 'react';
import { Link2 } from 'lucide-react';
import { StaggerItem } from '../../step-panel/stagger-item.component';
import type { PublicUrlTemplateProps } from './interfaces/public-url-template-props.interface';
import styles from './public-url.module.css';

export const PublicUrlTemplate: React.FC<PublicUrlTemplateProps> = ({
  publicAppUrl,
  onChange,
}) => (
  <div className={styles['public-url']}>
    <StaggerItem>
      <span className={styles['public-url__label']}>Public Application URL</span>
      <div className={styles['public-url__field']}>
        <div className={styles['public-url__prefix']}>
          <Link2 size={16} aria-hidden="true" />
        </div>
        <input
          type="text"
          className={styles['public-url__input']}
          value={publicAppUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="http://localhost:3000"
        />
      </div>
      <p className={styles['public-url__hint']}>
        Used as the base domain for SSO callbacks, email links, and webhook verifications.
      </p>
    </StaggerItem>
  </div>
);
