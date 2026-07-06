import React from 'react';
import { DbSectionProps } from '../../interfaces/db-section-props.interface';
import styles from './db-section.module.css';

export const DbSectionTemplate: React.FC<DbSectionProps> = ({
  dbType,
  setDbType,
  dbUrl,
  setDbUrl,
}) => {
  return (
    <section className={styles.section}>
      <h2 className={styles['section-header']}>PostgreSQL Database</h2>
      <div className={styles['setting-list']}>
        <div className={styles['setting-row']}>
          <div className={styles['setting-info']}>
            <span className={styles['setting-label']}>Connection Location</span>
            <span className={styles['setting-desc']}>Use local embedded Nix or connect externally.</span>
          </div>
          <div className={styles['setting-action']}>
            <div className={styles['segmented-control']}>
              <button
                type="button"
                className={`${styles['segment-btn']} ${dbType === 'local' ? styles['segment-btn-active'] : ''}`}
                onClick={() => setDbType('local')}
              >
                Local
              </button>
              <button
                type="button"
                className={`${styles['segment-btn']} ${dbType === 'remote' ? styles['segment-btn-active'] : ''}`}
                onClick={() => setDbType('remote')}
              >
                Remote
              </button>
            </div>
          </div>
        </div>

        <div className={`${styles['expandable-area']} ${dbType === 'remote' ? styles['expandable-area-active'] : ''}`}>
          <div className={styles['expandable-content']}>
            <div className={`${styles['expandable-inner']} ${styles['input-wrapper']}`}>
              <label className={styles['input-label']}>Connection URL</label>
              <div className={styles['input-box']}>
                <input
                  type="text"
                  className={styles['input-field']}
                  placeholder="postgresql://user:pass@host:5432/db"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  required={dbType === 'remote'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DbSectionTemplate;
