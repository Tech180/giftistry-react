import React from 'react';
import styles from './setup-timeline.module.css';
import { Check } from 'lucide-react';
import { SetupTimelineTemplateProps } from './interfaces/setup-timeline-template-props.interface';

export const SetupTimelineTemplate: React.FC<SetupTimelineTemplateProps> = ({
  step,
  steps,
}) => {
  return (
    <div className={styles.timeline}>
      {steps.map((s) => {
        const isActive = step === s.id;
        const isCompleted = step > s.id;
        const Icon = s.icon;

        return (
          <div
            key={s.id}
            className={`${styles.step} ${isActive ? styles['step-active'] : ''} ${
              isCompleted ? styles['step-completed'] : ''
            }`}
          >
            <div className={styles['step-circle']}>
              {isCompleted ? <Check size={14} /> : <Icon size={14} />}
            </div>
            <div className={styles['step-info']}>
              <span className={styles['step-label']}>{s.label}</span>
              <span className={styles['step-desc']}>{s.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
