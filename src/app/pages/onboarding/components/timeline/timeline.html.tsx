import React from 'react';
import { Check } from 'lucide-react';
import type { TimelineTemplateProps } from './interfaces/timeline-template-props.interface';
import styles from './timeline.module.css';

export const TimelineTemplate: React.FC<TimelineTemplateProps> = ({ steps, activeIndex }) => (
  <nav aria-label="Progress" className={styles['timeline']}>
    <ol className={styles['timeline__list']}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;

        return (
          <li key={step.id} className={styles['timeline__item']}>
            {!isLast ? (
              <div className={styles['timeline__line']} aria-hidden="true">
                <div
                  className={[
                    styles['timeline__line-fill'],
                    isPast ? styles['timeline__line-fill--past'] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              </div>
            ) : null}
            <div
              className={[
                styles['timeline__circle'],
                isActive ? styles['timeline__circle--active'] : '',
                isPast ? styles['timeline__circle--past'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden="true"
            >
              <span
                className={[
                  styles['timeline__num'],
                  isActive || isPast ? styles['timeline__num--hidden'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {index + 1}
              </span>
              <span
                className={[
                  styles['timeline__dot'],
                  isActive ? styles['timeline__dot--active'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
              <Check
                size={14}
                strokeWidth={3}
                className={[
                  styles['timeline__check'],
                  isPast ? styles['timeline__check--past'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </div>
            <div>
              <span
                className={[
                  styles['timeline__title'],
                  isActive || isPast ? styles['timeline__title--emphasis'] : '',
                  isActive ? styles['timeline__title--active'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {step.title}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  </nav>
);
