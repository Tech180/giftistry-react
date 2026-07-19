import React from 'react';
import { Check } from 'lucide-react';
import { OnboardingTimelineTemplateProps } from './interfaces/onboarding-timeline-template-props.interface';
import styles from './onboarding-timeline.module.css';

export const OnboardingTimelineTemplate: React.FC<OnboardingTimelineTemplateProps> = ({
  steps,
  activeIndex,
}) => {
  return (
    <nav aria-label="Progress" className={styles.nav}>
      <ol className={styles.list}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const stateClass = isActive
            ? styles['item-active']
            : isPast
              ? styles['item-past']
              : '';

          return (
            <li key={step.id} className={`${styles.item} ${stateClass}`.trim()}>
              {!isLast && (
                <div className={styles.line} aria-hidden="true">
                  <div className={styles['line-fill']} />
                </div>
              )}
              <div className={styles.circle} aria-hidden="true">
                <span className={styles.num}>{index + 1}</span>
                <span className={styles.dot} />
                <Check size={14} strokeWidth={3} className={styles.check} />
              </div>
              <div>
                <span className={styles.title}>{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
