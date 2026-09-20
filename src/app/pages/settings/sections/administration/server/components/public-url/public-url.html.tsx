import React from 'react';
import { SettingGroup, SettingItem } from '../../../components';
import type { Props } from './interfaces/props.interface';
import styles from './public-url.module.css';

export const PublicUrlTemplate: React.FC<Props> = ({
  publicAppUrl,
  setPublicAppUrl,
}) => (
  <section className={styles['public-url']}>
    <h2 className={styles['public-url__header']}>Public App URL</h2>
    <SettingGroup className={styles['public-url__group']}>
      <SettingItem
        title="Browser-facing URL"
        description="Used for transactional emails, CORS, and WebAuthn. No trailing slash."
        layout="column"
      >
        <input
          type="url"
          className={styles['public-url__input']}
          placeholder="https://giftistry.example.com"
          value={publicAppUrl}
          onChange={(e) => setPublicAppUrl(e.target.value)}
        />
      </SettingItem>
    </SettingGroup>
  </section>
);
