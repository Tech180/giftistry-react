import React from 'react';
import styles from './setup-timeline.module.css';
import { Check, LucideIcon } from 'lucide-react';

interface SetupStep {
  id: number;
  label: string;
  desc: string;
  icon: LucideIcon;
}

interface SetupTimelineTemplateProps {
  step: number;
  steps: SetupStep[];
}

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
            className={`${styles.step} ${isActive ? styles.stepActive : ''} ${
              isCompleted ? styles.stepCompleted : ''
            }`}
          >
            <div className={styles.stepCircle}>
              {isCompleted ? <Check size={14} /> : <Icon size={14} />}
            </div>
            <div className={styles.stepInfo}>
              <span className={styles.stepLabel}>{s.label}</span>
              <span className={styles.stepDesc}>{s.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
