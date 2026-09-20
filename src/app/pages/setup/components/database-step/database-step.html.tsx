import React from 'react';
import styles from './database-step.module.css';
import type { DatabaseStepTemplateProps } from './interfaces/template-props.interface';

export const DatabaseStepTemplate: React.FC<DatabaseStepTemplateProps> = ({
  dbType,
  dbUrl,
  errors,
  onFieldChange,
}) => (
  <div className={`${styles['database-step']} ${styles['database-step--active']}`}>
    <header className={styles['database-step__header']}>
      <h2 className={styles['database-step__heading']}>Database Configuration</h2>
      <p className={styles['database-step__subheading']}>
        Select how you want to store application data. For standard deployments, the local option
        requires zero configuration.
      </p>
    </header>

    <div className={styles['database-step__radio-list']}>
      <div
        className={`${styles['database-step__radio-card']} ${
          dbType === 'local' ? styles['database-step__radio-card--selected'] : ''
        }`}
      >
        <label className={styles['database-step__radio-option']}>
          <input
            type="radio"
            name="db_type"
            value="local"
            className={styles['database-step__radio-input']}
            checked={dbType === 'local'}
            onChange={() => onFieldChange('dbType', 'local')}
          />
          <div className={styles['database-step__radio-circle']} />
          <div className={styles['database-step__radio-body']}>
            <div className={styles['database-step__radio-title-row']}>
              <span className={styles['database-step__radio-title']}>Local PostgreSQL</span>
              <span className={styles['database-step__badge']}>Recommended</span>
            </div>
            <p className={styles['database-step__radio-desc']}>
              Use the local PostgreSQL database from your environment. Best for personal use or
              small-scale deployments without an external database server.
            </p>
          </div>
        </label>
      </div>

      <div
        className={`${styles['database-step__radio-card']} ${
          dbType === 'remote' ? styles['database-step__radio-card--selected'] : ''
        }`}
      >
        <label className={styles['database-step__radio-option']}>
          <input
            type="radio"
            name="db_type"
            value="remote"
            className={styles['database-step__radio-input']}
            checked={dbType === 'remote'}
            onChange={() => onFieldChange('dbType', 'remote')}
          />
          <div className={styles['database-step__radio-circle']} />
          <div className={styles['database-step__radio-body']}>
            <span className={styles['database-step__radio-title']}>External PostgreSQL</span>
            <p className={styles['database-step__radio-desc']}>
              Connect to a dedicated database server for higher performance, reliability, and
              scaling in production environments.
            </p>
          </div>
        </label>
        {dbType === 'remote' && (
          <div className={styles['database-step__remote-fields']}>
            <label htmlFor="dbUrl" className={styles['database-step__label']}>
              Connection URL
            </label>
            <input
              id="dbUrl"
              type="text"
              className={`${styles['database-step__input']} ${
                errors.dbUrl ? styles['database-step__input--error'] : ''
              }`}
              placeholder="postgres://username:password@hostname:5432/database"
              value={dbUrl}
              onChange={(e) => onFieldChange('dbUrl', e.target.value)}
              autoComplete="off"
            />
            {errors.dbUrl && (
              <p className={styles['database-step__field-error']}>{errors.dbUrl}</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
