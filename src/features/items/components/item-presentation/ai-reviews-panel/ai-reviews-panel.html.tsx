import React from 'react';
import { Sparkles } from 'lucide-react';
import { Props } from './interfaces/props.interface';
import styles from './ai-reviews-panel.module.css';

export const AiReviewsPanelTemplate: React.FC<Props> = ({
  reviews,
  reviewsLoading,
  reviewsError,
}) => {
  if (reviewsLoading) {
    return (
      <div className={styles['ai-reviews-panel']}>
        <div className={styles['ai-reviews-panel__header']}>
          <Sparkles size={12} />
          AI Review Synthesis
        </div>
        <p className={styles['ai-reviews-panel__summary']}>Loading reviews...</p>
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className={styles['ai-reviews-panel']}>
        <p className={styles['ai-reviews-panel__summary']}>{reviewsError}</p>
      </div>
    );
  }

  if (!reviews) return null;

  return (
    <div className={styles['ai-reviews-panel']}>
      <div className={styles['ai-reviews-panel__header']}>
        <Sparkles size={12} />
        AI Review Synthesis
      </div>
      <p className={styles['ai-reviews-panel__summary']}>{reviews.summary}</p>
      <div className={styles['ai-reviews-panel__grid']}>
        <div>
          <h5
            className={`${styles['ai-reviews-panel__title']} ${styles['ai-reviews-panel__title--pros']}`}
          >
            Pros
          </h5>
          <ul className={styles['ai-reviews-panel__list']}>
            {reviews.pros.map((pro) => (
              <li key={pro} className={styles['ai-reviews-panel__item']}>
                <span
                  className={`${styles['ai-reviews-panel__mark']} ${styles['ai-reviews-panel__mark--pro']}`}
                >
                  ✓
                </span>{' '}
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5
            className={`${styles['ai-reviews-panel__title']} ${styles['ai-reviews-panel__title--cons']}`}
          >
            Cons
          </h5>
          <ul className={styles['ai-reviews-panel__list']}>
            {reviews.cons.map((con) => (
              <li key={con} className={styles['ai-reviews-panel__item']}>
                <span
                  className={`${styles['ai-reviews-panel__mark']} ${styles['ai-reviews-panel__mark--con']}`}
                >
                  ✗
                </span>{' '}
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
