import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import styles from './install-step.module.css';
import type { InstallStepTemplateProps } from './interfaces/template-props.interface';

export const InstallStepTemplate: React.FC<InstallStepTemplateProps> = ({ rows }) => (
  <div className={`${styles['install-step']} ${styles['install-step--active']}`}>
    <header className={styles['install-step__header']}>
      <h2 className={styles['install-step__heading']}>Installing System</h2>
      <p className={styles['install-step__subheading']}>
        Please do not close this window while we configure your environment.
      </p>
    </header>

    <div className={styles['install-step__panel']}>
      <ul className={styles['install-step__log']}>
        {rows.map(({ task, labelModifier }) => (
          <li key={task.id} className={styles['install-step__row']}>
            <span className={styles['install-step__icon']}>
              {task.status === 'active' && (
                <Loader2 size={16} className={styles['install-step__spin']} aria-hidden />
              )}
              {task.status === 'done' && (
                <Check size={16} className={styles['install-step__check']} aria-hidden />
              )}
              {task.status === 'pending' && <span className={styles['install-step__dot']} />}
            </span>
            <span
              className={`${styles['install-step__label']} ${
                labelModifier ? styles[labelModifier] : ''
              }`}
            >
              {task.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
