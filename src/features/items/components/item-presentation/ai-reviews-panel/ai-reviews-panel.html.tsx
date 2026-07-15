import React from 'react';
import { Sparkles } from 'lucide-react';
import { AiReviewsPanelProps } from './interfaces/ai-reviews-panel-props.interface';
import styles from './ai-reviews-panel.module.css';

export const AiReviewsPanel: React.FC<AiReviewsPanelProps> = ({
  reviews,
  reviewsLoading,
  reviewsError,
}) => {
  if (reviewsLoading) {
    return (
      <div className={styles['ai-reviews-box']}>
        <div className={styles['ai-reviews-header']}>
          <Sparkles size={12} />
          AI Review Synthesis
        </div>
        <p className={styles['ai-reviews-summary']}>Loading reviews...</p>
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className={styles['ai-reviews-box']}>
        <p className={styles['ai-reviews-summary']}>{reviewsError}</p>
      </div>
    );
  }

  if (!reviews) return null;

  return (
    <div className={styles['ai-reviews-box']}>
      <div className={styles['ai-reviews-header']}>
        <Sparkles size={12} />
        AI Review Synthesis
      </div>
      <p className={styles['ai-reviews-summary']}>{reviews.summary}</p>
      <div className={styles['pros-cons-grid']}>
        <div>
          <h5 className={styles['pro-con-title']} style={{ color: 'var(--success)' }}>
            Pros
          </h5>
          <ul className={styles['pro-con-list']}>
            {reviews.pros.map((pro) => (
              <li key={pro}>
                <span style={{ color: 'var(--success)' }}>✓</span> {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className={styles['pro-con-title']} style={{ color: 'var(--error)' }}>
            Cons
          </h5>
          <ul className={styles['pro-con-list']}>
            {reviews.cons.map((con) => (
              <li key={con}>
                <span style={{ color: 'var(--error)' }}>✗</span> {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
