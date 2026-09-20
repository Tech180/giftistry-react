import React from 'react';
import { Check } from 'lucide-react';
import styles from './timeline.module.css';
import type { TimelineTemplateProps } from './interfaces/template-props.interface';

export const TimelineTemplate: React.FC<TimelineTemplateProps> = ({ steps }) => (
  <nav aria-label="Progress" className={styles.timeline}>
    <ol className={styles['timeline__list']}>
      {steps.map((s, index) => {
        const isLast = index === steps.length - 1;

        return (
          <li
            key={s.id}
            className={`${styles['timeline__item']} ${
              s.active ? styles['timeline__item--active'] : ''
            } ${s.completed ? styles['timeline__item--completed'] : ''}`}
          >
            {!isLast && <div className={styles['timeline__line']} aria-hidden="true" />}
            <div className={styles['timeline__row']}>
              <span className={styles['timeline__circle']}>
                {s.completed ? (
                  <Check size={12} className={styles['timeline__check']} />
                ) : (
                  <span className={styles['timeline__number']}>{s.id}</span>
                )}
              </span>
              <span className={styles['timeline__info']}>
                <span className={styles['timeline__label']}>{s.label}</span>
                <span className={styles['timeline__desc']}>{s.desc}</span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  </nav>
);
