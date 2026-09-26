import React from 'react';
import { Button, Switch } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './tutorial.module.css';

export const TutorialTemplate: React.FC<TemplateProps> = ({
  chapters,
  isBusy,
  welcomeEnabled,
  isWelcomeSaving,
  onWelcomeEnabledChange,
  onRestartAll,
  onReplaySample,
  onStartChapter,
}) => (
  <section className={styles['tutorial']} aria-labelledby="account-tutorial-title">
    <div className={styles['tutorial__header']}>
      <div className={styles['tutorial__header-copy']}>
        <h2 id="account-tutorial-title" className={styles['tutorial__title']}>
          Product tutorial
        </h2>
        <p className={styles['tutorial__subtitle']}>
          Replay the sample list, restart from the beginning, or jump into a specific chapter.
        </p>
      </div>
    </div>

    <div className={styles['tutorial__toggle-row']}>
      <div>
        <div className={styles['tutorial__toggle-title']}>Show welcome</div>
        <div className={styles['tutorial__toggle-desc']}>
          When on, Giftistry can show the product welcome after you sign in.
        </div>
      </div>
      <Switch
        checked = {
          welcomeEnabled
        }
        disabled = {
          isBusy || isWelcomeSaving
        }
        onChange = {
          onWelcomeEnabledChange
        }
        aria-label = {
          'Show welcome'
        }
      />
    </div>

    <div className={styles['tutorial__actions']}>
      <Button
        variant = {
          'secondary'
        }
        disabled = {
          isBusy || isWelcomeSaving
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
          isBusy || isWelcomeSaving
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
                isBusy || isWelcomeSaving
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
