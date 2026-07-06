import React from 'react';
import { Switch } from 'shared/ui';
import { MetaTemplateProps } from './interfaces/meta-template-props.interface';
import styles from './meta.module.css';

export const MetaTemplate: React.FC<MetaTemplateProps> = ({
  isOwner,
  commenterName,
  isAnonymous,
  setIsAnonymous,
}) => (
  <div className={styles.row}>
    <div className={styles['posting-as']}>
      <strong className={`${styles['name-value']} ${isAnonymous ? styles['is-anonymous'] : ''}`}>
        {commenterName}
      </strong>
    </div>

    {!isOwner && (
      <div className={styles['meta-right']}>
        <div className={styles['anon-toggle-row']}>
          <span className={styles['anon-toggle-label']}>Anonymous</span>
          <Switch checked={isAnonymous} onChange={setIsAnonymous} aria-label="Post anonymously" />
        </div>
      </div>
    )}
  </div>
);
