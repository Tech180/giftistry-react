import React from 'react';
import { Button } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './tutorial.module.css';

export const TutorialTemplate: React.FC<TemplateProps> = ({
  chapters,
  isBusy,
  onRestartAll,
  onReplaySample,
  onStartChapter,
}) => (
  <section className={styles['tutorial']} aria-labelledby="account-tutorial-title">
    <div className={styles['tutorial__header']}>
      <h2 id="account-tutorial-title" className={styles['tutorial__title']}>
        Product tutorial
      </h2>
      <p className={styles['tutorial__subtitle']}>
        Replay the sample list, restart from the beginning, or jump into a specific chapter.
      </p>
    </div>

    <div className={styles['tutorial__actions']}>
      <Button
        variant = {
          'secondary'
        }
        disabled = {
          isBusy
        }
        onClick = {
          onRestartAll
        }
      >
        Restart tutorial
      </Button>
      <Button
        variant = {
          'secondary'
        }
        disabled = {
          isBusy
        }
        onClick = {
          onReplaySample
        }
      >
        Replay sample
      </Button>
    </div>

    <ul className={styles['tutorial__list']}>
      {chapters.map((chapter) => {
        const statusClass = [
          styles['tutorial__status'],
          chapter.status === 'completed' ? styles['tutorial__status--completed'] : '',
          chapter.status === 'skipped' ? styles['tutorial__status--skipped'] : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <li key={chapter.id} className={styles['tutorial__row']}>
            <div className={styles['tutorial__row-copy']}>
              <p className={styles['tutorial__row-title']}>{chapter.title}</p>
              <p className={styles['tutorial__row-desc']}>{chapter.description}</p>
            </div>
            <span className={statusClass}>{chapter.status}</span>
            <Button
              size = {
                'sm'
              }
              variant = {
                'secondary'
              }
              disabled = {
                isBusy
              }
              onClick = {
                () => onStartChapter(chapter.id)
              }
            >
              {chapter.status === 'pending' ? 'Start' : 'Replay'}
            </Button>
          </li>
        );
      })}
    </ul>
  </section>
);
