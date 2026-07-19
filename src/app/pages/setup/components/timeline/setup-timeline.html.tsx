import React from 'react';
import { Check } from 'lucide-react';
import styles from './setup-timeline.module.css';
import { SetupTimelineTemplateProps } from './interfaces/setup-timeline-template-props.interface';

export const SetupTimelineTemplate: React.FC<SetupTimelineTemplateProps> = ({
  step,
  steps,
}) => {
  return (
    <nav aria-label="Progress" className={styles.nav}>
      <ol className={styles.timeline}>
        {steps.map((s, index) => {
          const isLast = index === steps.length - 1;
          const completed = step >= 4 ? true : step > s.id;
          const active = step >= 4 ? false : step === s.id;

          return (
            <li
              key={s.id}
              className={`${styles.step} ${active ? styles['step-active'] : ''} ${
                completed ? styles['step-completed'] : ''
              }`}
            >
              {!isLast && <div className={styles['step-line']} aria-hidden="true" />}
              <div className={styles['step-row']}>
                <span className={styles['step-circle']}>
                  {completed ? (
                    <Check size={12} className={styles['check-icon']} />
                  ) : (
                    <span className={styles['step-number']}>{s.id}</span>
                  )}
                </span>
                <span className={styles['step-info']}>
                  <span className={styles['step-label']}>{s.label}</span>
                  <span className={styles['step-desc']}>{s.desc}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
